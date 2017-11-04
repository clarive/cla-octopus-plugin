(function(params) {

    var data = params.data || {};

    var apiKey = Cla.ui.textField({
        name: 'apikey',
        fieldLabel: _('API Key'),
        value: data.apikey || '',
        allowBlank: false,
    });

    var octopusUrl = Cla.ui.textField({
        name: 'url',
        fieldLabel: _('Octopus URL'),
        value: data.url || '',
        allowBlank: false,
    });

    var projectName = Cla.ui.textField({
        name: 'project',
        fieldLabel: _('Octopus Project Name'),
        value: data.project || '',
        allowBlank: false,
    });

    var environmentName = Cla.ui.textField({
        name: 'environment',
        fieldLabel: _('Octopus Environment Name'),
        value: data.environment || '',
        allowBlank: false,
    });

    var createRelease = Cla.ui.checkBox({
        fieldLabel: _('Create Release in Octopus'),
        name: 'checkboxRelease',
        checked: data.checkboxRelease == 1 ? true : false
    });
    createRelease.on('check', function() {
        var checked = createRelease.checked;
        if (checked) {
            idRelease.hide();
            version.show();
        } else {
            idRelease.show();
            version.hide();
        }
    });
    var idRelease = Cla.ui.textField({
        fieldLabel: _('Release ID'),
        name: 'idRelease',
        value: data.idRelease || '',
        hidden: data.checkboxRelease == true ? true : false
    });

    var version = Cla.ui.textField({
        name: 'version',
        fieldLabel: _('Release version'),
        value: data.version || '',
        hidden: data.checkboxRelease == true ? false : true
    });

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            apiKey,
            octopusUrl,
            projectName,
            environmentName,
            createRelease,
            idRelease,
            version
        ]
    });

    return panel;
})