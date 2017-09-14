# Octopus Plugin

The Octopus plugin will allow you to perform deployments with Octopus.

## Requirements

There are no requirements outlined in Clarive in order to work with this plugin.

## Installation

To install the plugin, place the `cla-octopus-plugin` folder inside the `CLARIVE_BASE/plugins`
directory in a Clarive instance.

## How to Use

Once the plugin is correctly installed, you will have a new palette service called 'Octopus Deployment'.

### Octopus Deployment:

This palette service will let you perform deployments with Octopus.
The main fields are:

- **API Key** - API key for interaction with Octopus.
- **Octopus URL** - Octopus URL. 
- **Project Name** - Project Name to deploy to in Octopus.
- **Environment Name** - Environment Name to deploy to in Octopus.
- **Create Release** - Check to create a new release.
- **Release ID** - When `Create Release` is not selected, indicate the Octopus Release ID to deploy to.

Configuration example:

    API key: API-392839302
    Octopus URL: http://octopus.machine
    Project Name: MyProject
    Environment Name: MyEnvironment

- **Errors and Output** - These two fields are related to manage control errors. Options are:
   - **Fail and Output Error** - Search for configurated error pattern in script output. If found, an error message is displayed in the monitor showing the match.
   - **Warn and Output Warn** - Search for the configured warning pattern in script output. If found, an error message is displayed in the monitor showing the match.
   - **Custom** - The the Errors combo is set to custom, a new form is displayed for defining behavior using these fields:
      - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the monitor.
      - **Warn** - Range of return code values to warn the user. A warn message will be displayed in the monitor.
      - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the monitor.
   - **Silent** - Silence all errors found.
