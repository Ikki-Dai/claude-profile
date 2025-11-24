#!/usr/bin/env node

/**
 * Nacos Configuration Client
 * 用于查询 Nacos 配置中心的配置项
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const crypto = require('crypto');

// 颜色定义
const COLORS = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

class NacosClient {
    constructor(serverUrl, username = '', password = '', accessToken = '', timeout = 10000, useAdminApi = false) {
        this.serverUrl = serverUrl.replace(/\/$/, '');
        this.username = username;
        this.password = password;
        this.accessToken = accessToken;
        this.timeout = timeout;
        this.useAdminApi = useAdminApi; // 是否使用 v3 管理员 API
        this.defaultHeaders = {
            'User-Agent': 'Claude-Code-Nacos-Client/2.0',
            'Accept': 'application/json,text/plain,*/*',
            'Connection': 'keep-alive'
        };

        // 设置认证
        if (accessToken) {
            this.defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    /**
     * 执行 HTTP 请求
     * @param {string} url - 请求 URL
     * @param {Object} options - 请求选项
     * @returns {Promise<Object>} 响应数据
     */
    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const httpModule = isHttps ? https : http;

            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: options.method || 'GET',
                headers: { ...this.defaultHeaders, ...options.headers },
                timeout: this.timeout
            };

            // 基础认证
            if (this.username && this.password && !this.accessToken) {
                const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
                requestOptions.headers['Authorization'] = `Basic ${auth}`;
            }

            const req = httpModule.request(requestOptions, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const result = {
                            statusCode: res.statusCode,
                            headers: res.headers,
                            data: data
                        };

                        // 尝试解析 JSON，失败则返回原始文本
                        try {
                            result.data = JSON.parse(data);
                        } catch (e) {
                            // 保持原始文本
                        }

                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(result);
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage || 'Request failed'}`));
                        }
                    } catch (error) {
                        reject(new Error(`Response parsing error: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`Request timeout (${this.timeout}ms)`));
            });

            if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
                const body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
                req.write(body);
            }

            req.end();
        });
    }

    /**
     * 获取配置项 (使用 v1 用户 API)
     * @param {string} dataId - 配置项 ID
     * @param {string} group - 配置组
     * @param {string} namespace - 命名空间
     * @returns {Promise<Object>} 配置信息
     */
    async getConfig(dataId, group = 'DEFAULT_GROUP', namespace = 'public') {
        if (!dataId || dataId.trim().length === 0) {
            return {
                success: false,
                error: '配置项 ID (dataId) 不能为空',
                suggestions: ['请提供有效的配置项 ID']
            };
        }

        if (this.useAdminApi) {
            return this.getConfigV3(dataId, group, namespace);
        } else {
            return this.getConfigV1(dataId, group, namespace);
        }
    }

    /**
     * 使用 v3 管理员 API 获取配置 (官方文档规范)
     * @param {string} dataId - 配置项 ID
     * @param {string} groupName - 配置组名
     * @param {string} namespaceId - 命名空间 ID
     * @returns {Promise<Object>} 配置信息
     */
    async getConfigV3(dataId, groupName = 'DEFAULT_GROUP', namespaceId = 'public') {
        try {
            const endpoint = '/nacos/v3/admin/cs/config';
            const params = new URLSearchParams({
                dataId: dataId.trim(),
                groupName: groupName
            });

            // 官方 API 使用 namespaceId 参数
            if (namespaceId && namespaceId !== 'public') {
                params.append('namespaceId', namespaceId);
            }

            const url = `${this.serverUrl}${endpoint}?${params.toString()}`;
            const response = await this.makeRequest(url);

            // 官方 API 返回统一格式: {code, message, data}
            if (typeof response.data === 'object' && response.data.code !== undefined) {
                if (response.data.code === 0) {
                    const configData = response.data.data;
                    return {
                        success: true,
                        dataId: configData.dataId,
                        group: configData.groupName,
                        namespace: configData.namespaceId,
                        content: configData.content,
                        md5: configData.md5,
                        contentType: configData.type || this.detectContentType(dataId),
                        size: configData.content ? configData.content.length : 0,
                        timestamp: Date.now(),
                        // 额外的官方字段
                        id: configData.id,
                        description: configData.desc,
                        configTags: configData.configTags,
                        appName: configData.appName,
                        createTime: configData.createTime,
                        modifyTime: configData.modifyTime,
                        createUser: configData.createUser,
                        createIp: configData.createIp,
                        encryptedDataKey: configData.encryptedDataKey,
                        apiVersion: 'v3-admin'
                    };
                } else {
                    return {
                        success: false,
                        error: `API 错误: ${response.data.message} (code: ${response.data.code})`,
                        dataId: dataId,
                        group: groupName,
                        namespace: namespaceId
                    };
                }
            } else {
                // 如果不是标准格式，尝试按 v1 格式处理
                return this.handleUnknownFormat(response, dataId, groupName, namespaceId);
            }

        } catch (error) {
            const suggestions = this.getErrorSuggestions(error, 'getConfigV3');
            return {
                success: false,
                error: error.message,
                dataId: dataId,
                group: groupName,
                namespace: namespaceId,
                suggestions: suggestions
            };
        }
    }

    /**
     * 使用 v1 用户 API 获取配置 (原有实现)
     * @param {string} dataId - 配置项 ID
     * @param {string} group - 配置组
     * @param {string} namespace - 命名空间
     * @returns {Promise<Object>} 配置信息
     */
    async getConfigV1(dataId, group = 'DEFAULT_GROUP', namespace = 'public') {
        try {
            const endpoint = '/nacos/v1/cs/configs';
            const params = new URLSearchParams({
                dataId: dataId.trim(),
                group: group
            });

            // v1 API 使用 tenant 参数指定命名空间
            if (namespace && namespace !== 'public') {
                params.append('tenant', namespace);
            }

            const url = `${this.serverUrl}${endpoint}?${params.toString()}`;
            const response = await this.makeRequest(url);

            // 计算内容的 MD5
            const content = typeof response.data === 'string' ? response.data : '';
            const md5Hash = content ? crypto.createHash('md5').update(content).digest('hex') : '';

            return {
                success: true,
                dataId: dataId,
                group: group,
                namespace: namespace,
                content: content,
                md5: md5Hash,
                contentType: this.detectContentType(dataId),
                size: content.length,
                timestamp: Date.now(),
                apiVersion: 'v1-user'
            };

        } catch (error) {
            const suggestions = this.getErrorSuggestions(error, 'getConfigV1');
            return {
                success: false,
                error: error.message,
                dataId: dataId,
                group: group,
                namespace: namespace,
                suggestions: suggestions
            };
        }
    }

    /**
     * 处理未知格式的响应
     * @param {Object} response - HTTP 响应
     * @param {string} dataId - 配置项 ID
     * @param {string} group - 配置组
     * @param {string} namespace - 命名空间
     * @returns {Promise<Object>} 处理结果
     */
    handleUnknownFormat(response, dataId, group, namespace) {
        if (typeof response.data === 'string') {
            // 直接返回配置内容
            const content = response.data;
            const md5Hash = content ? crypto.createHash('md5').update(content).digest('hex') : '';

            return {
                success: true,
                dataId: dataId,
                group: group,
                namespace: namespace,
                content: content,
                md5: md5Hash,
                contentType: this.detectContentType(dataId),
                size: content.length,
                timestamp: Date.now(),
                apiVersion: 'unknown-raw'
            };
        } else {
            return {
                success: false,
                error: `未知的响应格式: ${JSON.stringify(response.data).substring(0, 200)}`,
                dataId: dataId,
                group: group,
                namespace: namespace
            };
        }
    }

    /**
     * 获取历史配置版本
     * @param {string} dataId - 配置项 ID
     * @param {string} group - 配置组
     * @param {string} namespace - 命名空间
     * @returns {Promise<Object>} 历史版本列表
     */
    async getConfigHistory(dataId, group = 'DEFAULT_GROUP', namespace = 'public') {
        try {
            const endpoint = '/nacos/v1/cs/history';
            const params = new URLSearchParams({
                dataId: dataId.trim(),
                group: group
            });

            if (namespace && namespace !== 'public') {
                params.append('tenant', namespace);
            }

            const url = `${this.serverUrl}${endpoint}?${params.toString()}`;
            const response = await this.makeRequest(url);

            const historyItems = Array.isArray(response.data) ? response.data :
                               (response.data.historyItems || response.data.pageItems || []);

            return {
                success: true,
                dataId: dataId,
                group: group,
                namespace: namespace,
                historyItems: historyItems,
                totalCount: historyItems.length
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                dataId: dataId,
                group: group,
                namespace: namespace
            };
        }
    }

    /**
     * 发布配置项
     * @param {string} dataId - 配置项 ID
     * @param {string} group - 配置组
     * @param {string} content - 配置内容
     * @param {string} namespace - 命名空间
     * @returns {Promise<Object>} 发布结果
     */
    async publishConfig(dataId, group = 'DEFAULT_GROUP', content = '', namespace = 'public') {
        try {
            const endpoint = '/nacos/v1/cs/configs';
            const params = new URLSearchParams({
                dataId: dataId.trim(),
                group: group,
                content: content
            });

            if (namespace && namespace !== 'public') {
                params.append('tenant', namespace);
            }

            const url = `${this.serverUrl}${endpoint}`;
            const response = await this.makeRequest(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            return {
                success: true,
                dataId: dataId,
                group: group,
                namespace: namespace,
                message: '配置发布成功',
                response: response.data
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                dataId: dataId,
                group: group,
                namespace: namespace
            };
        }
    }

    /**
     * 列出指定命名空间的所有配置
     * @param {string} namespace - 命名空间
     * @param {number} pageNo - 页码
     * @param {number} pageSize - 页大小
     * @returns {Promise<Object>} 配置列表
     */
    async listConfigs(namespace = 'public', pageNo = 1, pageSize = 100) {
        try {
            const endpoint = '/nacos/v1/cs/configs';
            const params = new URLSearchParams({
                dataId: '*',
                group: '*',
                pageNo: pageNo.toString(),
                pageSize: pageSize.toString()
            });

            // 使用 tenant 参数指定命名空间
            if (namespace && namespace !== 'public') {
                params.append('tenant', namespace);
            } else {
                params.append('tenant', namespace);
            }

            const url = `${this.serverUrl}${endpoint}?${params.toString()}`;
            const response = await this.makeRequest(url);

            // Nacos API 返回配置项列表，格式可能有所不同
            let configurations = [];
            let totalCount = 0;

            if (typeof response.data === 'string') {
                // 如果返回的是文本内容，可能是配置内容而不是列表
                // 这种情况说明我们可能需要使用不同的端点
                configurations = [];
                totalCount = 0;
            } else if (Array.isArray(response.data)) {
                configurations = response.data;
                totalCount = response.data.length;
            } else if (typeof response.data === 'object') {
                configurations = response.data.configurations || response.data.pageItems || [];
                totalCount = response.data.totalCount || response.data.total || configurations.length;
            }

            return {
                success: true,
                namespace: namespace,
                configurations: configurations,
                totalCount: totalCount,
                currentPage: pageNo,
                pageSize: pageSize,
                rawResponse: response.data // 保留原始响应用于调试
            };

        } catch (error) {
            const suggestions = this.getErrorSuggestions(error, 'listConfigs');
            return {
                success: false,
                error: error.message,
                namespace: namespace,
                suggestions: suggestions
            };
        }
    }

    /**
     * 搜索配置项
     * @param {string} dataIdPattern - 配置项 ID 模式
     * @param {string} group - 配置组过滤
     * @param {string} namespace - 命名空间
     * @returns {Promise<Object>} 搜索结果
     */
    async searchConfigs(dataIdPattern = '*', group = '*', namespace = 'public') {
        try {
            const endpoint = '/nacos/v1/cs/configs';
            const params = new URLSearchParams({
                dataId: dataIdPattern,
                group: group
            });

            // 使用 tenant 参数指定命名空间
            if (namespace && namespace !== 'public') {
                params.append('tenant', namespace);
            } else {
                params.append('tenant', namespace);
            }

            const url = `${this.serverUrl}${endpoint}?${params.toString()}`;
            const response = await this.makeRequest(url);

            // 处理搜索结果
            let configurations = [];
            let totalCount = 0;

            if (typeof response.data === 'string') {
                // 单个配置项匹配
                configurations = [{
                    dataId: dataIdPattern,
                    group: group,
                    content: response.data,
                    namespace: namespace
                }];
                totalCount = 1;
            } else if (Array.isArray(response.data)) {
                configurations = response.data;
                totalCount = response.data.length;
            } else if (typeof response.data === 'object') {
                configurations = response.data.configurations || response.data.pageItems || [];
                totalCount = response.data.totalCount || response.data.total || configurations.length;
            }

            return {
                success: true,
                searchPattern: dataIdPattern,
                group: group,
                namespace: namespace,
                configurations: configurations,
                totalCount: totalCount,
                rawResponse: response.data // 保留原始响应用于调试
            };

        } catch (error) {
            const suggestions = this.getErrorSuggestions(error, 'searchConfigs');
            return {
                success: false,
                error: error.message,
                searchPattern: dataIdPattern,
                suggestions: suggestions
            };
        }
    }

    /**
     * 检测配置文件类型
     * @param {string} dataId - 配置项 ID
     * @returns {string} 文件类型
     */
    detectContentType(dataId) {
        const extension = dataId.split('.').pop().toLowerCase();
        const typeMap = {
            'properties': 'Properties',
            'yml': 'YAML',
            'yaml': 'YAML',
            'json': 'JSON',
            'xml': 'XML',
            'ini': 'INI',
            'conf': 'Config',
            'txt': 'Text'
        };
        return typeMap[extension] || 'Unknown';
    }

    /**
     * 根据错误类型提供建议
     * @param {Error} error - 错误对象
     * @param {string} operation - 操作类型
     * @returns {Array<string>} 建议列表
     */
    getErrorSuggestions(error, operation) {
        const suggestions = [];
        const errorMsg = error.message.toLowerCase();

        // 网络连接错误
        if (errorMsg.includes('econnrefused') || errorMsg.includes('connect')) {
            suggestions.push('检查 Nacos 服务器是否正在运行');
            suggestions.push('确认服务器地址和端口是否正确');
            suggestions.push('检查网络连接是否正常');
        }

        // 认证错误
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('unauthorized')) {
            suggestions.push('检查用户名和密码是否正确');
            suggestions.push('确认访问令牌 (access token) 是否有效');
            suggestions.push('检查用户是否有权限访问该配置');
        }

        // 配置不存在
        if (errorMsg.includes('404') && operation === 'getConfig') {
            suggestions.push('确认配置项 ID (dataId) 是否正确');
            suggestions.push('检查配置组 (group) 和命名空间 (namespace) 是否正确');
            suggestions.push('尝试使用 list-configs 查看可用配置');
        }

        // 超时错误
        if (errorMsg.includes('timeout')) {
            suggestions.push('增加请求超时时间');
            suggestions.push('检查网络延迟');
            suggestions.push('确认 Nacos 服务器性能是否正常');
        }

        // 通用建议
        if (suggestions.length === 0) {
            suggestions.push('检查请求参数是否正确');
            suggestions.push('确认 Nacos 服务器版本兼容性');
            suggestions.push('查看 Nacos 服务器日志获取更多信息');
        }

        return suggestions;
    }

    /**
     * 格式化配置输出
     * @param {Object} result - 配置结果
     * @returns {string} 格式化输出
     */
    formatConfigOutput(result) {
        if (!result.success) {
            let output = `${COLORS.red}❌ 获取配置失败: ${result.error}${COLORS.reset}\n\n`;
            output += `${COLORS.yellow}💡 建议:${COLORS.reset}\n`;
            result.suggestions.forEach(suggestion => {
                output += `   • ${suggestion}\n`;
            });
            return output;
        }

        let output = `${COLORS.green}✅ 配置获取成功${COLORS.reset}\n`;

        if (result.apiVersion === 'v3-admin') {
            output += `${COLORS.yellow}🔧 使用 v3 管理员 API${COLORS.reset}\n`;
        } else {
            output += `${COLORS.yellow}🔧 使用 v1 用户 API${COLORS.reset}\n`;
        }

        output += `\n${COLORS.blue}📋 基本信息:${COLORS.reset}\n`;
        output += `   Data ID: ${COLORS.cyan}${result.dataId}${COLORS.reset}\n`;
        output += `   Group: ${COLORS.cyan}${result.group}${COLORS.reset}\n`;
        output += `   Namespace: ${COLORS.cyan}${result.namespace}${COLORS.reset}\n`;
        output += `   Type: ${COLORS.cyan}${result.contentType}${COLORS.reset}\n`;
        output += `   Size: ${COLORS.cyan}${result.size}${COLORS.reset} 字节\n`;
        output += `   MD5: ${COLORS.cyan}${result.md5}${COLORS.reset}\n`;

        // v3 API 的额外字段
        if (result.apiVersion === 'v3-admin') {
            output += `\n${COLORS.blue}🏷️  元数据信息:${COLORS.reset}\n`;
            if (result.id) output += `   ID: ${COLORS.cyan}${result.id}${COLORS.reset}\n`;
            if (result.description) output += `   描述: ${COLORS.cyan}${result.description}${COLORS.reset}\n`;
            if (result.configTags) output += `   标签: ${COLORS.cyan}${result.configTags}${COLORS.reset}\n`;
            if (result.appName) output += `   应用: ${COLORS.cyan}${result.appName}${COLORS.reset}\n`;
            if (result.createUser) output += `   创建人: ${COLORS.cyan}${result.createUser}${COLORS.reset}\n`;
            if (result.createIp) output += `   创建IP: ${COLORS.cyan}${result.createIp}${COLORS.reset}\n`;
            if (result.createTime) output += `   创建时间: ${COLORS.cyan}${new Date(result.createTime).toLocaleString()}${COLORS.reset}\n`;
            if (result.modifyTime) output += `   修改时间: ${COLORS.cyan}${new Date(result.modifyTime).toLocaleString()}${COLORS.reset}\n`;
            if (result.encryptedDataKey) output += `   加密: ${COLORS.yellow}是${COLORS.reset}\n`;
        }

        if (result.content) {
            output += `\n${COLORS.blue}📝 配置内容:${COLORS.reset}\n`;

            // 根据内容类型进行格式化
            if (result.contentType === 'JSON' || result.contentType === 'json') {
                try {
                    const jsonData = JSON.parse(result.content);
                    output += '```json\n' + JSON.stringify(jsonData, null, 2) + '\n```\n';
                } catch (e) {
                    output += '```\n' + result.content + '\n```\n';
                }
            } else if (result.contentType === 'YAML' || result.contentType === 'yaml') {
                output += '```yaml\n' + result.content + '\n```\n';
            } else {
                output += '```\n' + result.content + '\n```\n';
            }
        }

        return output;
    }

    /**
     * 格式化配置列表输出
     * @param {Object} result - 列表结果
     * @returns {string} 格式化输出
     */
    formatListOutput(result) {
        if (!result.success) {
            let output = `${COLORS.red}❌ 获取配置列表失败: ${result.error}${COLORS.reset}\n\n`;
            output += `${COLORS.yellow}💡 建议:${COLORS.reset}\n`;
            result.suggestions.forEach(suggestion => {
                output += `   • ${suggestion}\n`;
            });
            return output;
        }

        let output = `${COLORS.green}✅ 配置列表获取成功${COLORS.reset}\n`;
        output += `${COLORS.blue}📊 列表信息:${COLORS.reset}\n`;
        output += `   Namespace: ${COLORS.cyan}${result.namespace}${COLORS.reset}\n`;
        output += `   总数量: ${COLORS.cyan}${result.totalCount}${COLORS.reset}\n`;
        output += `   当前页: ${COLORS.cyan}${result.currentPage}${COLORS.reset}\n`;
        output += `   页大小: ${COLORS.cyan}${result.pageSize}${COLORS.reset}\n\n`;

        if (result.configurations && result.configurations.length > 0) {
            output += `${COLORS.blue}📋 配置项:${COLORS.reset}\n`;
            result.configurations.forEach((config, index) => {
                output += `${index + 1}. `;
                output += `${COLORS.cyan}${config.dataId || config.data_id}${COLORS.reset}`;
                output += ` (${COLORS.yellow}${config.group || 'DEFAULT_GROUP'}${COLORS.reset})`;
                if (config.appName) {
                    output += ` [${COLORS.green}${config.appName}${COLORS.reset}]`;
                }
                output += '\n';
            });
        } else {
            output += `${COLORS.yellow}📭 该命名空间中没有配置项${COLORS.reset}\n`;
        }

        return output;
    }

    /**
     * 格式化搜索结果输出
     * @param {Object} result - 搜索结果
     * @returns {string} 格式化输出
     */
    formatSearchOutput(result) {
        if (!result.success) {
            let output = `${COLORS.red}❌ 搜索配置失败: ${result.error}${COLORS.reset}\n\n`;
            output += `${COLORS.yellow}💡 建议:${COLORS.reset}\n`;
            result.suggestions.forEach(suggestion => {
                output += `   • ${suggestion}\n`;
            });
            return output;
        }

        let output = `${COLORS.green}✅ 配置搜索完成${COLORS.reset}\n`;
        output += `${COLORS.blue}🔍 搜索信息:${COLORS.reset}\n`;
        output += `   搜索模式: ${COLORS.cyan}${result.searchPattern || '*'}${COLORS.reset}\n`;
        output += `   Group: ${COLORS.cyan}${result.group || '*'}${COLORS.reset}\n`;
        output += `   Namespace: ${COLORS.cyan}${result.namespace}${COLORS.reset}\n`;
        output += `   找到数量: ${COLORS.cyan}${result.totalCount}${COLORS.reset}\n\n`;

        if (result.configurations && result.configurations.length > 0) {
            output += `${COLORS.blue}📋 匹配的配置项:${COLORS.reset}\n`;
            result.configurations.forEach((config, index) => {
                output += `${index + 1}. `;
                output += `${COLORS.cyan}${config.dataId || config.data_id}${COLORS.reset}`;
                output += ` (${COLORS.yellow}${config.group || 'DEFAULT_GROUP'}${COLORS.reset})`;
                if (config.appName) {
                    output += ` [${COLORS.green}${config.appName}${COLORS.reset}]`;
                }
                output += '\n';
            });
        } else {
            output += `${COLORS.yellow}📭 没有找到匹配的配置项${COLORS.reset}\n`;
            output += `${COLORS.blue}💡 搜索建议:${COLORS.reset}\n`;
            output += `   • 尝试使用更通用的搜索模式\n`;
            output += `   • 使用通配符 * 进行模糊匹配\n`;
            output += `   • 检查命名空间是否正确\n`;
        }

        return output;
    }

    /**
     * 获取并显示配置
     * @param {string} dataId - 配置项 ID
     * @param {string} group - 配置组
     * @param {string} namespace - 命名空间
     */
    async getConfigAndDisplay(dataId, group = 'DEFAULT_GROUP', namespace = 'public') {
        console.log(`${COLORS.blue}🔍 正在获取配置...${COLORS.reset}`);
        console.log(`   Data ID: ${COLORS.cyan}${dataId}${COLORS.reset}`);
        console.log(`   Group: ${COLORS.cyan}${group}${COLORS.reset}`);
        console.log(`   Namespace: ${COLORS.cyan}${namespace}${COLORS.reset}`);
        console.log('');

        const result = await this.getConfig(dataId, group, namespace);
        const output = this.formatConfigOutput(result);
        console.log(output);

        return result;
    }

    /**
     * 列出并显示配置
     * @param {string} namespace - 命名空间
     * @param {number} pageNo - 页码
     * @param {number} pageSize - 页大小
     */
    async listConfigsAndDisplay(namespace = 'public', pageNo = 1, pageSize = 100) {
        console.log(`${COLORS.blue}📋 正在获取配置列表...${COLORS.reset}`);
        console.log(`   Namespace: ${COLORS.cyan}${namespace}${COLORS.reset}`);
        console.log('');

        const result = await this.listConfigs(namespace, pageNo, pageSize);
        const output = this.formatListOutput(result);
        console.log(output);

        return result;
    }

    /**
     * 搜索并显示配置
     * @param {string} pattern - 搜索模式
     * @param {string} group - 配置组过滤
     * @param {string} namespace - 命名空间
     */
    async searchConfigsAndDisplay(pattern = '', group = '', namespace = 'public') {
        console.log(`${COLORS.blue}🔍 正在搜索配置...${COLORS.reset}`);
        console.log(`   Pattern: ${COLORS.cyan}${pattern || '*'}${COLORS.reset}`);
        console.log(`   Group: ${COLORS.cyan}${group || '*'}${COLORS.reset}`);
        console.log(`   Namespace: ${COLORS.cyan}${namespace}${COLORS.reset}`);
        console.log('');

        const result = await this.searchConfigs(pattern, group, namespace);
        const output = this.formatSearchOutput(result);
        console.log(output);

        return result;
    }
}

// 命令行接口
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`${COLORS.blue}Nacos 配置中心客户端${COLORS.reset}`);
        console.log('');
        console.log('用法:');
        console.log('  node nacos-client.js <server-url> <command> [options]');
        console.log('');
        console.log('命令:');
        console.log('  get <dataId> [group] [namespace]           - 获取指定配置');
        console.log('  list [namespace] [pageNo] [pageSize]       - 列出配置');
        console.log('  search <pattern> [group] [namespace]       - 搜索配置');
        console.log('  history <dataId> [group] [namespace]       - 查看配置历史');
        console.log('  publish <dataId> <content> [group] [ns]    - 发布配置');
        console.log('');
        console.log('认证选项:');
        console.log('  --username <user>    - 用户名');
        console.log('  --password <pass>    - 密码');
        console.log('  --token <token>      - 访问令牌');
        console.log('  --admin              - 使用 v3 管理员 API (需管理员权限)');
        console.log('  --v1                 - 使用 v1 用户 API (默认)');
        console.log('');
        console.log('示例:');
        console.log('  node nacos-client.js http://localhost:8848 get application.properties');
        console.log('  node nacos-client.js http://localhost:8848 get application.properties --admin');
        console.log('  node nacos-client.js http://localhost:8848 list dev');
        console.log('  node nacos-client.js http://localhost:8848 search "application*" --username nacos --password nacos');
        console.log('  node nacos-client.js http://localhost:8848 history application.properties');
        console.log('  node nacos-client.js http://localhost:8848 publish test-config "key=value"');
        console.log('');
        console.log('API 版本说明:');
        console.log('  --admin : 使用 v3 管理员 API，返回完整配置元数据');
        console.log('  --v1    : 使用 v1 用户 API，仅返回配置内容 (默认)');
        process.exit(1);
    }

    // 解析参数
    const serverUrl = args[0];
    const command = args[1] || '';

    if (!serverUrl || !command) {
        console.error(`${COLORS.red}错误: 缺少必需的参数${COLORS.reset}`);
        process.exit(1);
    }

    // 解析认证选项
    let username = '';
    let password = '';
    let accessToken = '';
    let useAdminApi = false;
    let commandArgs = args.slice(2);

    for (let i = 0; i < commandArgs.length; i++) {
        switch (commandArgs[i]) {
            case '--username':
                username = commandArgs[++i];
                break;
            case '--password':
                password = commandArgs[++i];
                break;
            case '--token':
                accessToken = commandArgs[++i];
                break;
            case '--admin':
                useAdminApi = true;
                break;
            case '--v1':
                useAdminApi = false;
                break;
        }
    }

    // 过滤掉认证选项，获取命令参数
    const cleanArgs = commandArgs.filter(arg =>
        !arg.startsWith('--username') &&
        !arg.startsWith('--password') &&
        !arg.startsWith('--token') &&
        !arg.startsWith('--admin') &&
        !arg.startsWith('--v1') &&
        !['--username', '--password', '--token', '--admin', '--v1'].includes(arg)
    );

    const client = new NacosClient(serverUrl, username, password, accessToken, 10000, useAdminApi);

    // 执行命令
    switch (command.toLowerCase()) {
        case 'get':
            const dataId = cleanArgs[0];
            const group = cleanArgs[1] || 'DEFAULT_GROUP';
            const namespace = cleanArgs[2] || 'public';

            if (!dataId) {
                console.error(`${COLORS.red}错误: get 命令需要指定 dataId${COLORS.reset}`);
                process.exit(1);
            }

            client.getConfigAndDisplay(dataId, group, namespace)
                .then(result => {
                    process.exit(result.success ? 0 : 1);
                })
                .catch(error => {
                    console.error(`${COLORS.red}执行失败: ${error.message}${COLORS.reset}`);
                    process.exit(1);
                });
            break;

        case 'list':
            const listNamespace = cleanArgs[0] || 'public';
            const pageNo = parseInt(cleanArgs[1]) || 1;
            const pageSize = parseInt(cleanArgs[2]) || 100;

            client.listConfigsAndDisplay(listNamespace, pageNo, pageSize)
                .then(result => {
                    process.exit(result.success ? 0 : 1);
                })
                .catch(error => {
                    console.error(`${COLORS.red}执行失败: ${error.message}${COLORS.reset}`);
                    process.exit(1);
                });
            break;

        case 'search':
            const pattern = cleanArgs[0] || '';
            const searchGroup = cleanArgs[1] || '';
            const searchNamespace = cleanArgs[2] || 'public';

            client.searchConfigsAndDisplay(pattern, searchGroup, searchNamespace)
                .then(result => {
                    process.exit(result.success ? 0 : 1);
                })
                .catch(error => {
                    console.error(`${COLORS.red}执行失败: ${error.message}${COLORS.reset}`);
                    process.exit(1);
                });
            break;

        case 'history':
            const historyDataId = cleanArgs[0];
            const historyGroup = cleanArgs[1] || 'DEFAULT_GROUP';
            const historyNamespace = cleanArgs[2] || 'public';

            if (!historyDataId) {
                console.error(`${COLORS.red}错误: history 命令需要指定 dataId${COLORS.reset}`);
                process.exit(1);
            }

            client.getConfigHistory(historyDataId, historyGroup, historyNamespace)
                .then(result => {
                    if (result.success) {
                        console.log(`${COLORS.green}✅ 配置历史获取成功${COLORS.reset}`);
                        console.log(`${COLORS.blue}📋 历史信息:${COLORS.reset}`);
                        console.log(`   Data ID: ${COLORS.cyan}${result.dataId}${COLORS.reset}`);
                        console.log(`   Group: ${COLORS.cyan}${result.group}${COLORS.reset}`);
                        console.log(`   Namespace: ${COLORS.cyan}${result.namespace}${COLORS.reset}`);
                        console.log(`   历史版本数: ${COLORS.cyan}${result.totalCount}${COLORS.reset}\n`);

                        if (result.historyItems.length > 0) {
                            console.log(`${COLORS.blue}📜 历史版本:${COLORS.reset}`);
                            result.historyItems.forEach((item, index) => {
                                console.log(`${index + 1}. ${item.dataId} - ${item.timestamp || item.time || 'Unknown time'}`);
                                if (item.md5) console.log(`   MD5: ${item.md5}`);
                            });
                        } else {
                            console.log(`${COLORS.yellow}📭 没有找到历史版本${COLORS.reset}`);
                        }
                    } else {
                        console.error(`${COLORS.red}❌ 获取配置历史失败: ${result.error}${COLORS.reset}`);
                    }
                    process.exit(result.success ? 0 : 1);
                })
                .catch(error => {
                    console.error(`${COLORS.red}执行失败: ${error.message}${COLORS.reset}`);
                    process.exit(1);
                });
            break;

        case 'publish':
            const publishDataId = cleanArgs[0];
            const publishContent = cleanArgs[1];
            const publishGroup = cleanArgs[2] || 'DEFAULT_GROUP';
            const publishNamespace = cleanArgs[3] || 'public';

            if (!publishDataId || !publishContent) {
                console.error(`${COLORS.red}错误: publish 命令需要指定 dataId 和 content${COLORS.reset}`);
                process.exit(1);
            }

            client.publishConfig(publishDataId, publishGroup, publishContent, publishNamespace)
                .then(result => {
                    if (result.success) {
                        console.log(`${COLORS.green}✅ 配置发布成功${COLORS.reset}`);
                        console.log(`${COLORS.blue}📋 发布信息:${COLORS.reset}`);
                        console.log(`   Data ID: ${COLORS.cyan}${result.dataId}${COLORS.reset}`);
                        console.log(`   Group: ${COLORS.cyan}${result.group}${COLORS.reset}`);
                        console.log(`   Namespace: ${COLORS.cyan}${result.namespace}${COLORS.reset}`);
                        console.log(`   Content: ${COLORS.cyan}${publishContent}${COLORS.reset}`);
                    } else {
                        console.error(`${COLORS.red}❌ 配置发布失败: ${result.error}${COLORS.reset}`);
                    }
                    process.exit(result.success ? 0 : 1);
                })
                .catch(error => {
                    console.error(`${COLORS.red}执行失败: ${error.message}${COLORS.reset}`);
                    process.exit(1);
                });
            break;

        default:
            console.error(`${COLORS.red}错误: 未知命令 '${command}'${COLORS.reset}`);
            console.log('可用命令: get, list, search, history, publish');
            process.exit(1);
    }
}

module.exports = NacosClient;