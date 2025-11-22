#!/usr/bin/env node

/**
 * Maven GAV 检索工具
 * 使用阿里云 Maven 仓库 API 检索构件版本并智能排序
 */

const https = require('https');
const { URL } = require('url');

// 颜色定义
const COLORS = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// API 配置
const API_CONFIG = {
    baseURL: 'https://maven.aliyun.com/artifact/aliyunMaven/searchArtifactByGav',
    timeout: 10000,
    userAgent: 'Maven-GAV-Search-Tool/2.0.0'
};

/**
 * 版本比较器类 - 优化版本
 */
class VersionComparator {
    constructor() {
        this.suffixPriority = new Map([
            // 正式版本
            ['final', 1000], ['release', 1000], ['ga', 1000], ['', 1000],
            // 稳定版本
            ['sp', 900], ['sr', 900],
            // 候选版本
            ['rc', 800], ['cr', 800],
            // 里程碑版本
            ['m', 500], ['milestone', 500],
            // 测试版本
            ['beta', 400], ['b', 400], ['alpha', 300], ['a', 300],
            // 快照版本
            ['snapshot', 100], ['snap', 100], ['dev', 50], ['build', 25]
        ]);

        // 缓存解析结果以提高性能
        this.parseCache = new Map();
    }

    /**
     * 解析版本字符串
     */
    parseVersion(version) {
        if (!version) return { major: 0, minor: 0, patch: 0, suffix: '', priority: 0 };

        // 使用缓存
        if (this.parseCache.has(version)) {
            return this.parseCache.get(version);
        }

        const cleanVersion = version.replace(/^[vV]/, '');
        const versionPattern = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:[-.]?(.+))?$/i;
        const match = cleanVersion.toLowerCase().match(versionPattern);

        let result;
        if (!match) {
            result = { major: 0, minor: 0, patch: 0, suffix: cleanVersion.toLowerCase(), priority: 0 };
        } else {
            const major = parseInt(match[1]) || 0;
            const minor = parseInt(match[2]) || 0;
            const patch = parseInt(match[3]) || 0;
            const suffix = match[4] || '';

            const suffixMatch = suffix.match(/([a-zA-Z]+)(\d*)/);
            const suffixType = suffixMatch ? suffixMatch[1] : '';
            const suffixNum = suffixMatch ? suffixMatch[2] : '';

            const priority = this.suffixPriority.get(suffixType) || 200;
            const adjustedPriority = suffixNum ? priority + parseInt(suffixNum) * 0.1 : priority;

            result = { major, minor, patch, suffix: suffixType, priority: adjustedPriority };
        }

        // 缓存结果
        if (this.parseCache.size < 1000) { // 限制缓存大小
            this.parseCache.set(version, result);
        }

        return result;
    }

    /**
     * 比较两个版本
     */
    compareVersions(a, b) {
        const versionA = this.parseVersion(a);
        const versionB = this.parseVersion(b);

        // 优化比较逻辑
        if (versionA.major !== versionB.major) return versionA.major - versionB.major;
        if (versionA.minor !== versionB.minor) return versionA.minor - versionB.minor;
        if (versionA.patch !== versionB.patch) return versionA.patch - versionB.patch;

        return versionA.priority - versionB.priority;
    }

    /**
     * 排序版本数组
     */
    sortVersions(versions, descending = true) {
        if (!versions?.length) return [];

        // 去重并过滤
        const uniqueVersions = [...new Set(versions.filter(v => v?.trim()))];

        return uniqueVersions.sort((a, b) => {
            const result = this.compareVersions(a, b);
            return descending ? -result : result;
        });
    }
}

/**
 * HTTP 请求工具类
 */
class HttpClient {
    static async request(url) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'User-Agent': API_CONFIG.userAgent,
                    'Accept': 'application/json',
                    'Connection': 'keep-alive'
                },
                timeout: API_CONFIG.timeout
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.setEncoding('utf8');

                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve({ statusCode: res.statusCode, data: jsonData });
                    } catch (error) {
                        resolve({ statusCode: res.statusCode, data: data });
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('请求超时'));
            });

            req.end();
        });
    }
}

/**
 * 命令行参数解析器
 */
class ArgumentParser {
    static parse(args) {
        const result = {
            groupId: '',
            artifactId: '',
            sortOrder: 'desc',
            limit: 20,
            repoId: 'all',
            verbose: false,
            raw: false
        };

        for (let i = 0; i < args.length; i++) {
            switch (args[i]) {
                case '-h':
                case '--help':
                    result.showHelp = true;
                    break;
                case '-s':
                case '--sort':
                    result.sortOrder = args[++i];
                    break;
                case '-l':
                case '--limit':
                    result.limit = Math.max(1, parseInt(args[++i]) || 20);
                    break;
                case '-r':
                case '--repo':
                    result.repoId = args[++i];
                    break;
                case '-v':
                case '--verbose':
                    result.verbose = true;
                    break;
                case '--raw':
                    result.raw = true;
                    break;
                default:
                    if (!result.groupId) {
                        result.groupId = args[i];
                    } else if (!result.artifactId) {
                        result.artifactId = args[i];
                    } else {
                        throw new Error(`过多的参数: ${args[i]}`);
                    }
                    break;
            }
        }

        return result;
    }

    static validate(args) {
        if (!args.groupId || !args.artifactId) {
            throw new Error('GroupId 和 ArtifactId 都是必需的');
        }
        if (args.sortOrder !== 'desc' && args.sortOrder !== 'asc') {
            throw new Error("排序选项必须是 'desc' 或 'asc'");
        }
    }

    static showHelp() {
        console.log(`${COLORS.blue}Maven GAV 检索工具${COLORS.reset}`);
        console.log('');
        console.log('用法: maven-search <groupId> <artifactId> [选项]');
        console.log('');
        console.log('参数:');
        console.log('  groupId      Maven GroupId (必需)');
        console.log('  artifactId   Maven ArtifactId (必需，支持 * 通配符)');
        console.log('');
        console.log('选项:');
        console.log('  -h, --help           显示此帮助信息');
        console.log('  -s, --sort SORT      排序方式: desc (降序, 默认) 或 asc (升序)');
        console.log('  -l, --limit LIMIT    限制返回的版本数量 (默认: 20)');
        console.log('  -r, --repo REPO      仓库ID (默认: all)');
        console.log('  -v, --verbose        详细输出');
        console.log('  --raw                显示原始 API 响应');
        console.log('');
        console.log('示例:');
        console.log('  maven-search org.springframework.boot spring-boot-starter-web');
        console.log('  maven-search org.springframework.* spring-* --limit 50');
        console.log('  maven-search org.springframework spring-core --sort asc');
    }
}

/**
 * 输出工具类
 */
class OutputFormatter {
    static success(text) { console.log(`${COLORS.green}${text}${COLORS.reset}`); }
    static error(text) { console.error(`${COLORS.red}${text}${COLORS.reset}`); }
    static warning(text) { console.log(`${COLORS.yellow}${text}${COLORS.reset}`); }
    static info(text) { console.log(`${COLORS.blue}${text}${COLORS.reset}`); }

    static printVersions(versions, totalFound, limit, sortOrder) {
        this.info(`找到 ${totalFound} 个版本，显示前 ${versions.length} 个（${sortOrder === 'desc' ? '降序' : '升序'}）:`);
        console.log('');

        for (const version of versions) {
            this.success(`▸ ${version}`);
        }

        console.log('');
        this.info('搜索完成！');
    }

    static printSearchStart(groupId, artifactId) {
        this.info('正在搜索 Maven 构件...');
        console.log(`GroupId: ${COLORS.green}${groupId}${COLORS.reset}`);
        console.log(`ArtifactId: ${COLORS.green}${artifactId}${COLORS.reset}`);
        console.log('');
    }

    static printNoResults() {
        this.warning('未找到匹配的版本');
        console.log('');
        this.info('提示:');
        console.log('1. 请检查 GroupId 和 ArtifactId 是否正确');
        console.log('2. 某些构件可能需要特定的仓库权限');
        console.log('3. 使用 --verbose 参数查看详细的 API 响应');
        console.log('4. 尝试使用更通用的搜索模式（如使用 * 通配符）');
    }
}

/**
 * 数据提取器类
 */
class DataExtractor {
    static extractVersions(responseData) {
        const versions = new Set();
        const artifacts = [];

        let artifactList = [];

        // 支持多种响应格式
        if (responseData.object && Array.isArray(responseData.object)) {
            artifactList = responseData.object;
        } else if (responseData.success && responseData.data?.artifacts) {
            artifactList = responseData.data.artifacts;
        } else if (responseData.data?.artifacts) {
            artifactList = responseData.data.artifacts;
        } else if (responseData.artifacts) {
            artifactList = responseData.artifacts;
        } else if (Array.isArray(responseData)) {
            artifactList = responseData;
        }

        for (const artifact of artifactList) {
            if (artifact) {
                const version = artifact.version || artifact.v;
                if (version?.trim()) {
                    const cleanVersion = version.trim();
                    versions.add(cleanVersion);

                    if (artifact.groupId || artifact.g) {
                        artifacts.push({
                            groupId: artifact.groupId || artifact.g,
                            artifactId: artifact.artifactId || artifact.a,
                            version: cleanVersion,
                            repoId: artifact.repoId || artifact.r
                        });
                    }
                }
            }
        }

        return { versions: Array.from(versions), artifacts };
    }
}

/**
 * 主应用程序类
 */
class MavenSearchApp {
    constructor() {
        this.comparator = new VersionComparator();
    }

    async run(args) {
        try {
            const options = ArgumentParser.parse(args);

            if (options.showHelp) {
                ArgumentParser.showHelp();
                return;
            }

            ArgumentParser.validate(options);

            if (options.verbose) {
                console.log(`${COLORS.blue}[调试] 配置: ${JSON.stringify(options, null, 2)}${COLORS.reset}`);
            }

            await this.performSearch(options);

        } catch (error) {
            OutputFormatter.error(`错误: ${error.message}`);
            if (args.includes('-v') || args.includes('--verbose')) {
                console.error(error.stack);
            }
            process.exit(1);
        }
    }

    async performSearch(options) {
        const url = `${API_CONFIG.baseURL}?groupId=${encodeURIComponent(options.groupId)}&artifactId=${encodeURIComponent(options.artifactId)}&version=&repoId=${options.repoId}&_input_charset=utf-8`;

        if (options.verbose) {
            console.log(`${COLORS.blue}[调试] 请求 URL: ${url}${COLORS.reset}`);
        }

        OutputFormatter.printSearchStart(options.groupId, options.artifactId);

        const response = await HttpClient.request(url);

        if (response.statusCode !== 200) {
            throw new Error(`API 请求失败，状态码: ${response.statusCode}`);
        }

        if (options.raw) {
            console.log(JSON.stringify(response.data, null, 2));
            return;
        }

        if (options.verbose) {
            console.log(`${COLORS.yellow}[调试] API 响应:${COLORS.reset}`);
            console.log(JSON.stringify(response.data, null, 2));
        }

        const { versions, artifacts } = DataExtractor.extractVersions(response.data);

        if (versions.length === 0) {
            OutputFormatter.printNoResults();
            return;
        }

        const sortedVersions = this.comparator.sortVersions(versions, options.sortOrder === 'desc');
        const limitedVersions = sortedVersions.slice(0, options.limit);

        OutputFormatter.printVersions(limitedVersions, versions.length, options.limit, options.sortOrder);

        if (options.verbose && versions.length > options.limit) {
            OutputFormatter.warning(`提示: 还有 ${versions.length - options.limit} 个版本未显示，使用 --limit 参数可以显示更多`);
        }
    }
}

// 主入口
async function main() {
    const app = new MavenSearchApp();
    await app.run(process.argv.slice(2));
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(error => {
        console.error(`${COLORS.red}未处理的错误: ${error.message}${COLORS.reset}`);
        process.exit(1);
    });
}

module.exports = { VersionComparator, MavenSearchApp };