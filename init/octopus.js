var reg = require('cla/reg');

reg.register('service.octopus.task', {
    name: 'Octopus Deployment',
    icon: '/plugin/cla-octopus-plugin/icon/octopus.svg',
    form: '/plugin/cla-octopus-plugin/form/octopus-form.js',
    handler: function(ctx, params) {
        var ci = require("cla/ci");
        var log = require('cla/log');
        var reg = require('cla/reg');
        var web = require("cla/web");
        var util = require("cla/util");
        var myutils = require("myutils");
        var octopusServer = params.server;
        var apiKey = params.apikey || '';
        var octopusUrl = params.url || '';
        var projectName = params.project || '';
        var environmentName = params.environment || '';
        var checkboxRelease = params.checkboxRelease || true;
        var idRelease = params.idRelease || '';
        var version = params.version || '';
        var contentDeploy = {};
        var agent = web.agent({
            auto_parse: 0
        });
        var response = '';
        var headers = {
            'X-Octopus-ApiKey': apiKey,
            'content-type': 'application/json'
        };
        var urlproject = octopusUrl + '/api/projects/all';
        var urlEnvironments = octopusUrl + '/api/environments/all';
        var urlDeployments = octopusUrl + '/api/deployments';
        var urlReleases = octopusUrl + '/api/releases';

        var projectId = myutils.getId(agent, urlproject, headers, projectName);
        var environmentId = myutils.getId(agent, urlEnvironments, headers, environmentName);
        if (checkboxRelease == true) {
            if (projectId) {
                var Idchannel = myutils.getChannel(agent, headers, octopusUrl, projectId);
                var urlchannel = octopusUrl + '/api/deploymentprocesses/deploymentprocess-' + projectId + '/template?channel=' + Idchannel;
                response = agent.get(urlchannel, {
                    headers: headers
                });
                var content = JSON.parse(response.content);

                var selectedPackages = myutils.buildSelectedPackages(agent, headers, octopusUrl, content.Packages);
                if (!version) {
                    version = content.NextVersionIncrement;
                }
                var contentRelease = {
                    'ProjectId': projectId,
                    'Version': version,
                    'SelectedPackages': selectedPackages
                };
                response = myutils.post(agent, headers, urlReleases, contentRelease);

                var release = JSON.parse(response.content);
                contentDeploy = {
                    'ReleaseID': release.Id,
                    'EnvironmentID': environmentId
                };
                response = myutils.post(agent, headers, urlDeployments, contentDeploy);
                content = myutils.waitToFinishDeploy(ctx, agent, response, octopusUrl, headers);

                if (content.State == 'Failed') {
                    log.fatal(content.ErrorMessage);
                }
                log.info(_("Deployment successful"));
            } else {
                log.fatal(_("Project not found"));
            }
        } else {
            contentDeploy = {
                'ReleaseID': idRelease,
                'EnvironmentID': environmentId
            };
            response = myutils.post(agent, headers, urlDeployments, contentDeploy);
            content = myutils.waitToFinishDeploy(ctx, agent, response, octopusUrl, headers);
            if (content.State == 'Failed') {
                log.fatal(content.ErrorMessage);
            }
            log.info(_("Deployment successful"));
        }
    }
});