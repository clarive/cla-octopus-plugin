exports.getId = function(agent, url, headers, name) {
    var response = agent.get(url, {
        headers: headers
    });
    var collection = JSON.parse(response.content);
    var id;
    for (var i = 0; i < collection.length; i++) {
        if (collection[i].Name == name) {
            id = collection[i].Id;
            break;
        }
    };
    return id;
};

exports.post = function(agent, headers, url, content) {
    content = JSON.stringify(content);

    var response = agent.post(url, {
        headers: headers,
        content: content
    });
    return response;
};

exports.getChannel = function(agent, headers, octopusUrl, projectId) {
    var urlchannel = octopusUrl + '/api/projects/' + projectId + '/channels';
    var response = agent.get(urlchannel, {
        headers: headers
    });
    var content = JSON.parse(response.content);
    var items = content.Items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].IsDefault && items[i].ProjectId == projectId) {
            return items[i].Id;
        }
    }
    return;
};

exports.buildSelectedPackages = function(agent, headers, octopusUrl, packageRelease) {
    var selectedPackages = [];
    var version;
    var hashPackage;
    var response = agent.get(octopusUrl + '/api/packages', {
        headers: headers
    });
    var allPackages = JSON.parse(response.content);
    for (var i = 0; i < packageRelease.length; i++) {
        hashPackage = {};
        hashPackage.StepName = packageRelease[i].StepName;
        version = getVersion(allPackages, packageRelease[i].PackageId);
        hashPackage.Version = version;
        selectedPackages[i] = hashPackage;
    }
    return selectedPackages;
};

function getVersion(allPackages, packageId) {
    var items = allPackages.Items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].PackageId == packageId) {
            return items[i].Version;
        }
    }
};

exports.waitToFinishDeploy = function(agent, response, octopusUrl, headers) {
    var util = require("cla/util");
    var log = require('cla/log');
    var content = JSON.parse(response.content);
    var taskID = content.TaskId;
    var RESTQuery = octopusUrl + '/api/tasks/' + taskID;
    response = agent.get(RESTQuery, {
        headers: headers
    });
    content = JSON.parse(response.content);
    while (content['IsCompleted'] == false) {
        util.sleep(5);
        response = agent.get(RESTQuery, {
            headers: headers
        });
        content = JSON.parse(response.content);
        log.info(_("Waiting for completing task..."));

    }
    ctx.stash('_returned_octopus_response', response);
    return content;
};