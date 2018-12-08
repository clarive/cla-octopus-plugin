# Octopus Plugin

<img src="https://cdn.jsdelivr.net/gh/clarive/cla-octopus-plugin/public/icon/octopus.svg?sanitize=true" alt="Octopus Plugin" title="Octopus Plugin" width="120" height="120">

The Octopus plugin will allow you to perform deployments with Octopus.

## Requirements

There are no requirements outlined in Clarive in order to work with this plugin.

## Installation

To install the plugin, place the `cla-octopus-plugin` folder inside the `$CLARIVE_BASE/plugins`
directory in a Clarive instance.

### Octopus Deployment:

The different available parameters are:

- **API Key (variable name: api_key)** - API key for interaction with Octopus.
- **Octopus URL (url)** - URL to Octopus server. 
- **Octopus Project Name (project)** - Project Name to deploy to in Octopus.
- **Octopus Environment Name (environment)** - Environment Name to deploy to in Octopus.
- **Create Release in Octopus (release)** - Check to create a new release.
- **Release ID (id_release)** - When `Create Release` is not selected, indicate the Octopus Release ID to deploy to.
- **Release version (version)** - Select the version for the new release.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Op Name: **Octopus Deployment**

Example:

```yaml
    API key: API-392839302
    Octopus URL: http://octopus.machine
    Project Name: MyProject
    Environment Name: MyEnvironment
    Create Release in Octopus: 0
    Release version: 1.0.3-dev
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: Octopus demo
do:
   - octopus_deploy:
       api_key: 'API-392839302'         # Required
       url: 'http://octopus.machine'    # Required
       project: "MyProject"             # Required
       environment: "MyEnvironment"     # Required
       release: "0"                     # Required
       version: "1.0.3-dev"
```

```yaml
rule: Yet another Octopus demo
do:
   - octopus_deploy:
       api_key: 'API-392839302'         # Required
       url: 'http://octopus.machine'    # Required
       project: "MyProject"             # Required
       environment: "MyEnvironment"     # Required
       release: "1"                     # Required
       id_release: "102391"
```

##### Outputs

###### Success

The service will return the output from the Octopus API.

###### Possible configuration failures

**Deploy failed**

The service will return the output from the Octopus API.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "octopus_deploy": "url"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Command` not available for op "octopus_deploy"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.