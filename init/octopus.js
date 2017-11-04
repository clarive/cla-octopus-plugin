var reg = require('cla/reg');

reg.register('service.octopus.task', {
    name: 'Octopus Deployment',
    icon: '/plugin/cla-octopus-plugin/icon/octopus.svg',
    form: '/plugin/cla-octopus-plugin/form/octopus-form.js',
    rulebook: {
        moniker: 'octopus_deploy',
        description: _('Perform deployments with Octopus'),
        required: ['api_key', 'url', 'project', 'environment', 'release'],
        allow: ['api_key', 'url', 'project', 'environment', 'release', 'id_release',
        'version'],
        mapper: {
            'api_key': 'apikey',
            'release': 'checkboxRelease',
            'id_release': 'idRelease'
        },
        examples: [{
            octopus_deploy: {
                api_key: 'API-392839302',
                url: 'http://octopus.machine',
                project: "MyProject",
                environment: "MyEnvironment",
                release: "0",
                version: "1.0.3-dev"
            }
        },{
            octopus_deploy: {
                api_key: 'API-392839302',
                url: 'http://octopus.machine',
                project: "MyProject",
                environment: "MyEnvironment",
                release: "1",
                id_release: "102391"
            }
        }]
    },
    handler: function(ctx, params) {

        var log = require('cla/log');
        var reg = require('cla/reg');
        var web = require("cla/web");
        var util = require("cla/util");
        var myutils = require("myutils");
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