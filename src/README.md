## Modules

<dl>
<dt><a href="#module_dotenv">dotenv</a></dt>
<dd></dd>
<dt><a href="#module_Global">Global</a></dt>
<dd></dd>
<dt><a href="#module_Init">Init</a></dt>
<dd><p>Start <code>weldable</code></p>
</dd>
<dt><a href="#module_Logger">Logger</a></dt>
<dd></dd>
<dt><a href="#module_standalone">standalone</a></dt>
<dd></dd>
<dt><a href="#module_Typescript">Typescript</a></dt>
<dd></dd>
<dt><a href="#module_webpack">webpack</a></dt>
<dd></dd>
<dt><a href="#module_webpackConfigs">webpackConfigs</a></dt>
<dd></dd>
</dl>

<a name="module_dotenv"></a>

## dotenv

* [dotenv](#module_dotenv)
    * [~dotenv](#module_dotenv..dotenv) : <code>Object</code>
    * [~setupWebpackDotenvFile(filePath)](#module_dotenv..setupWebpackDotenvFile) ⇒ <code>undefined</code> \| <code>\*</code>
    * [~setupWebpackDotenvFilesForEnv(params)](#module_dotenv..setupWebpackDotenvFilesForEnv) ⇒ <code>Array</code>
    * [~setupDotenvFile(filePath)](#module_dotenv..setupDotenvFile) ⇒ <code>void</code>
    * [~setDotenvParam(params)](#module_dotenv..setDotenvParam)
    * [~setupDotenvFilesForEnv(params)](#module_dotenv..setupDotenvFilesForEnv) ⇒ <code>object</code>

<a name="module_dotenv..dotenv"></a>

### dotenv~dotenv : <code>Object</code>
Package for lib

**Kind**: inner constant of [<code>dotenv</code>](#module_dotenv)  
<a name="module_dotenv..setupWebpackDotenvFile"></a>

### dotenv~setupWebpackDotenvFile(filePath) ⇒ <code>undefined</code> \| <code>\*</code>
Set up a webpack dotenv plugin config.

**Kind**: inner method of [<code>dotenv</code>](#module_dotenv)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>filePath</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_dotenv..setupWebpackDotenvFilesForEnv"></a>

### dotenv~setupWebpackDotenvFilesForEnv(params) ⇒ <code>Array</code>
For use with webpack configurations. Set up multiple webpack dotenv file parameters.

**Kind**: inner method of [<code>dotenv</code>](#module_dotenv)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>params</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>[params.directory]</td><td><code>string</code></td><td><code>&quot;&lt;OPTIONS.contextPath&gt;&quot;</code></td>
    </tr><tr>
    <td>params.env</td><td><code>string</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="module_dotenv..setupDotenvFile"></a>

### dotenv~setupDotenvFile(filePath) ⇒ <code>void</code>
Set up, and access, a dotenv file and the related set of parameters.

**Kind**: inner method of [<code>dotenv</code>](#module_dotenv)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>filePath</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_dotenv..setDotenvParam"></a>

### dotenv~setDotenvParam(params)
Set an array of dotenv params

**Kind**: inner method of [<code>dotenv</code>](#module_dotenv)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>params</td><td><code>Array.&lt;{param: string, value: string, ignoreIfSet: boolean}&gt;</code></td>
    </tr>  </tbody>
</table>

<a name="module_dotenv..setupDotenvFilesForEnv"></a>

### dotenv~setupDotenvFilesForEnv(params) ⇒ <code>object</code>
A function for use with non-webpack configurations. Set up and access local and specific dotenv file parameters.
dotenv parameters are string based, failed or missing dotenv parameters return an empty string.

**Kind**: inner method of [<code>dotenv</code>](#module_dotenv)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>params</td><td><code>object</code></td><td></td><td></td>
    </tr><tr>
    <td>params.env</td><td><code>string</code></td><td></td><td></td>
    </tr><tr>
    <td>[params.relativePath]</td><td><code>string</code></td><td><code>&quot;&lt;OPTIONS.contextPath&gt;&quot;</code></td><td></td>
    </tr><tr>
    <td>[params.dotenvNamePrefix]</td><td><code>string</code></td><td><code>&quot;BUILD&quot;</code></td><td><p>Add an internal prefix to dotenv parameters used for configuration to avoid overlap.</p>
</td>
    </tr><tr>
    <td>[params.setBuildDefaults]</td><td><code>boolean</code></td><td><code>true</code></td><td></td>
    </tr><tr>
    <td>[params.isMessaging]</td><td><code>boolean</code></td><td><code>false</code></td><td></td>
    </tr><tr>
    <td>[params.setExposedParams]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>Ignore the potential for dotenv parameter overlap and attempt to set non-prefixed configuration parameters if not already set.</p>
</td>
    </tr>  </tbody>
</table>

<a name="module_Global"></a>

## Global

* [Global](#module_Global)
    * [~jsFileExtensions](#module_Global..jsFileExtensions) : <code>Array.&lt;string&gt;</code>
    * [~tsFileExtensions](#module_Global..tsFileExtensions) : <code>Array.&lt;string&gt;</code>
    * [~contextPath](#module_Global..contextPath) : <code>string</code>
    * [~OPTIONS](#module_Global..OPTIONS) : <code>Object</code>
    * [~errorMessageHandler(errors)](#module_Global..errorMessageHandler) ⇒ <code>string</code> \| <code>any</code> \| <code>Array.&lt;any&gt;</code>
    * [~isPromise(obj)](#module_Global..isPromise) ⇒ <code>boolean</code>
    * [~dynamicImport(file)](#module_Global..dynamicImport) ⇒ <code>Promise.&lt;any&gt;</code>
    * [~createFile(contents, options)](#module_Global..createFile) ⇒ <code>Object</code>
    * [~runCmd(cmd, settings)](#module_Global..runCmd) ⇒ <code>string</code>

<a name="module_Global..jsFileExtensions"></a>

### Global~jsFileExtensions : <code>Array.&lt;string&gt;</code>
JS file extensions

**Kind**: inner constant of [<code>Global</code>](#module_Global)  
<a name="module_Global..tsFileExtensions"></a>

### Global~tsFileExtensions : <code>Array.&lt;string&gt;</code>
TS file extensions

**Kind**: inner constant of [<code>Global</code>](#module_Global)  
<a name="module_Global..contextPath"></a>

### Global~contextPath : <code>string</code>
Global context path. On load set path.

**Kind**: inner constant of [<code>Global</code>](#module_Global)  
<a name="module_Global..OPTIONS"></a>

### Global~OPTIONS : <code>Object</code>
Global options/settings. One time _set, then freeze.

**Kind**: inner constant of [<code>Global</code>](#module_Global)  
<a name="module_Global..errorMessageHandler"></a>

### Global~errorMessageHandler(errors) ⇒ <code>string</code> \| <code>any</code> \| <code>Array.&lt;any&gt;</code>
Handle a variety of error types consistently.

**Kind**: inner method of [<code>Global</code>](#module_Global)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>errors</td><td><code>string</code> | <code>Array</code> | <code>object</code> | <code>any</code></td>
    </tr>  </tbody>
</table>

<a name="module_Global..isPromise"></a>

### Global~isPromise(obj) ⇒ <code>boolean</code>
Check if "is a Promise", "Promise like".

**Kind**: inner method of [<code>Global</code>](#module_Global)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td><td><code>Promise</code> | <code>*</code></td>
    </tr>  </tbody>
</table>

<a name="module_Global..dynamicImport"></a>

### Global~dynamicImport(file) ⇒ <code>Promise.&lt;any&gt;</code>
Import module regardless of CommonJS or ES.

**Kind**: inner method of [<code>Global</code>](#module_Global)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>file</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Global..createFile"></a>

### Global~createFile(contents, options) ⇒ <code>Object</code>
Create a file with a fallback name based on hashed contents.

**Kind**: inner method of [<code>Global</code>](#module_Global)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>contents</td><td><code>string</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.dir</td><td><code>string</code></td>
    </tr><tr>
    <td>options.ext</td><td><code>string</code></td>
    </tr><tr>
    <td>options.encoding</td><td><code>string</code></td>
    </tr><tr>
    <td>options.filename</td><td><code>string</code></td>
    </tr><tr>
    <td>options.resetDir</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>

<a name="module_Global..runCmd"></a>

### Global~runCmd(cmd, settings) ⇒ <code>string</code>
Execute a command

**Kind**: inner method of [<code>Global</code>](#module_Global)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>cmd</td><td><code>string</code></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.errorMessage</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Init"></a>

## Init
Start `weldable`

<a name="module_Init..weldable"></a>

### Init~weldable(options) ⇒ <code>Promise.&lt;void&gt;</code>
Organize package functionality.

**Kind**: inner method of [<code>Init</code>](#module_Init)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.isCreateTsConfigOnly</td><td><code>boolean</code></td>
    </tr><tr>
    <td>options.isStandalone</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>

<a name="module_Logger"></a>

## Logger

* [Logger](#module_Logger)
    * [~color](#module_Logger..color) : <code>Object</code>
    * [~consoleMessage](#module_Logger..consoleMessage) : <code>Object</code>

<a name="module_Logger..color"></a>

### Logger~color : <code>Object</code>
Console output colors

**Kind**: inner constant of [<code>Logger</code>](#module_Logger)  
<a name="module_Logger..consoleMessage"></a>

### Logger~consoleMessage : <code>Object</code>
Convenience wrapper for preset console messaging and colors.

**Kind**: inner constant of [<code>Logger</code>](#module_Logger)  
<a name="module_standalone"></a>

## standalone

* [standalone](#module_standalone)
    * [~createStandaloneTsConfig(aliasOptions, CreateTsConfig)](#module_standalone..createStandaloneTsConfig)
    * [~outputStandaloneSrcIndexFile()](#module_standalone..outputStandaloneSrcIndexFile) ⇒ <code>string</code>
    * [~createStandaloneSrcIndexFile(options, settings)](#module_standalone..createStandaloneSrcIndexFile)
    * [~outputStandaloneWebpackConfig(options, settings)](#module_standalone..outputStandaloneWebpackConfig) ⇒ <code>string</code>
    * [~createStandaloneWebpackConfig(options, settings)](#module_standalone..createStandaloneWebpackConfig)
    * [~outputStandalonePackageJson()](#module_standalone..outputStandalonePackageJson) ⇒ <code>string</code>
    * [~createStandalonePackageJson(options, settings)](#module_standalone..createStandalonePackageJson)
    * [~outputStandaloneBabelConfig()](#module_standalone..outputStandaloneBabelConfig) ⇒ <code>string</code>
    * [~createStandaloneBabelConfig(options, settings)](#module_standalone..createStandaloneBabelConfig)
    * [~standalone(settings)](#module_standalone..standalone)

<a name="module_standalone..createStandaloneTsConfig"></a>

### standalone~createStandaloneTsConfig(aliasOptions, CreateTsConfig)
Create a basic standalone tsconfig if isCreateTsConfig is false.
This can be overridden with CLI options, or if a tsconfig already exists.

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>aliasOptions</td><td><code>object</code></td>
    </tr><tr>
    <td>aliasOptions.isCreateTsConfig</td><td><code>boolean</code></td>
    </tr><tr>
    <td>aliasOptions.loader</td><td><code>string</code></td>
    </tr><tr>
    <td>CreateTsConfig</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="module_standalone..outputStandaloneSrcIndexFile"></a>

### standalone~outputStandaloneSrcIndexFile() ⇒ <code>string</code>
Output a basic index file.

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<a name="module_standalone..createStandaloneSrcIndexFile"></a>

### standalone~createStandaloneSrcIndexFile(options, settings)
Create a src/index file for webpack app entry.

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.contextPath</td><td><code>string</code></td>
    </tr><tr>
    <td>options.loader</td><td><code>string</code></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.filename</td><td><code>string</code></td>
    </tr><tr>
    <td>settings.createFile</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.outputStandaloneSrcIndexFile</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="module_standalone..outputStandaloneWebpackConfig"></a>

### standalone~outputStandaloneWebpackConfig(options, settings) ⇒ <code>string</code>
Output a file complete webpack configuration

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.loader</td><td><code>string</code></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.common</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.development</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.preprocessLoaderJs</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.preprocessLoaderTs</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.preprocessLoaderNone</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.production</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.setDotenvParam</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.setupWebpackDotenvFile</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.setupWebpackDotenvFilesForEnv</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.setupDotenvFile</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.setupDotenvFilesForEnv</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="module_standalone..createStandaloneWebpackConfig"></a>

### standalone~createStandaloneWebpackConfig(options, settings)
Update package.json, and conditionally a babel config, in the consuming project root.

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.contextPath</td><td><code>string</code></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.filename</td><td><code>string</code></td>
    </tr><tr>
    <td>settings.createFile</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.outputStandaloneWebpackConfig</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="module_standalone..outputStandalonePackageJson"></a>

### standalone~outputStandalonePackageJson() ⇒ <code>string</code>
Output a basic package.json

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<a name="module_standalone..createStandalonePackageJson"></a>

### standalone~createStandalonePackageJson(options, settings)
Update package.json, and conditionally a babel config, in the consuming project root.

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.contextPath</td><td><code>string</code></td>
    </tr><tr>
    <td>options.loader</td><td><code>string</code></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.createFile</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.packageFileName</td><td><code>string</code></td>
    </tr><tr>
    <td>settings.outputStandalonePackageJson</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.runCmd</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.webpackFileName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_standalone..outputStandaloneBabelConfig"></a>

### standalone~outputStandaloneBabelConfig() ⇒ <code>string</code>
Output a basic babel config file.

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<a name="module_standalone..createStandaloneBabelConfig"></a>

### standalone~createStandaloneBabelConfig(options, settings)
Create a basic babel config

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.contextPath</td><td><code>string</code></td>
    </tr><tr>
    <td>options.loader</td><td><code>string</code></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.createFile</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.filename</td><td><code>string</code></td>
    </tr><tr>
    <td>settings.outputStandaloneBabelConfig</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="module_standalone..standalone"></a>

### standalone~standalone(settings)
Organize and output a basic webpack configuration.

**Kind**: inner method of [<code>standalone</code>](#module_standalone)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.createStandaloneBabelConfig</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.createStandaloneSrcIndexFile</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.createStandaloneTsConfig</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.createStandalonePackageJson</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.createStandaloneWebpackConfig</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="module_Typescript"></a>

## Typescript
<a name="module_Typescript..createTsConfig"></a>

### Typescript~createTsConfig(dotenv, options, settings) ⇒ <code>undefined</code> \| <code>Object</code>
Create, or merge, a tsconfig file.

**Kind**: inner method of [<code>Typescript</code>](#module_Typescript)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>dotenv</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>dotenv._BUILD_DIST_DIR</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.baseTsConfig</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>options.contextPath</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>options.isCreateTsConfig</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.isMergeTsConfig</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.isRegenTsConfig</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>settings.configFilename</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>settings.isMessaging</td><td><code>boolean</code></td><td><p>Helps with standalone configuration</p>
</td>
    </tr>  </tbody>
</table>

<a name="module_webpack"></a>

## webpack

* [webpack](#module_webpack)
    * [~cleanDist(dotenv)](#module_webpack..cleanDist)
    * [~createWpConfig(options)](#module_webpack..createWpConfig) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~startWpErrorStatsHandler(err, stats, options)](#module_webpack..startWpErrorStatsHandler)
    * [~startWp(webpackConfig, options, settings)](#module_webpack..startWp) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_webpack..cleanDist"></a>

### webpack~cleanDist(dotenv)
Clean the "distribution" directory. Compensate for Webpack not cleaning output on development.

**Kind**: inner method of [<code>webpack</code>](#module_webpack)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>dotenv</td><td><code>object</code></td>
    </tr><tr>
    <td>dotenv._BUILD_DIST_DIR</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpack..createWpConfig"></a>

### webpack~createWpConfig(options) ⇒ <code>Promise.&lt;object&gt;</code>
Webpack merge base configuration files. If available merge extended configuration files.

**Kind**: inner method of [<code>webpack</code>](#module_webpack)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.nodeEnv</td><td><code>string</code></td>
    </tr><tr>
    <td>options.dotenv</td><td><code>object</code></td>
    </tr><tr>
    <td>options.extendedConfigs</td><td><code>Array.&lt;string&gt;</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpack..startWpErrorStatsHandler"></a>

### webpack~startWpErrorStatsHandler(err, stats, options)
webpack callback error and stats handler. Separated for testing.

**Kind**: inner method of [<code>webpack</code>](#module_webpack)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>err</td><td><code>*</code></td>
    </tr><tr>
    <td>stats</td><td><code>*</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.stats</td><td><code>undefined</code> | <code>string</code></td>
    </tr><tr>
    <td>options.statsFile</td><td><code>undefined</code> | <code>string</code></td>
    </tr><tr>
    <td>options.statsPath</td><td><code>undefined</code> | <code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpack..startWp"></a>

### webpack~startWp(webpackConfig, options, settings) ⇒ <code>Promise.&lt;void&gt;</code>
Start webpack development or production.

**Kind**: inner method of [<code>webpack</code>](#module_webpack)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>webpackConfig</td><td><code>object</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.nodeEnv</td><td><code>string</code></td>
    </tr><tr>
    <td>settings</td><td><code>object</code></td>
    </tr><tr>
    <td>settings.startWpErrorStatsHandler</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.webpack</td><td><code>function</code></td>
    </tr><tr>
    <td>settings.WebpackDevServer</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpackConfigs"></a>

## webpackConfigs

* [webpackConfigs](#module_webpackConfigs)
    * [~preprocessLoaderJs(dotenv)](#module_webpackConfigs..preprocessLoaderJs) ⇒ <code>Object</code>
    * [~preprocessLoaderTs(dotenv)](#module_webpackConfigs..preprocessLoaderTs) ⇒ <code>Object</code>
    * [~preprocessLoaderNone()](#module_webpackConfigs..preprocessLoaderNone) ⇒ <code>Object</code>
    * [~preprocessLoader(options)](#module_webpackConfigs..preprocessLoader) ⇒ <code>Object</code>
    * [~common(dotenv)](#module_webpackConfigs..common) ⇒ <code>Object</code>
    * [~development(dotenv)](#module_webpackConfigs..development) ⇒ <code>Object</code>
    * [~production(dotenv)](#module_webpackConfigs..production) ⇒ <code>Object</code>

<a name="module_webpackConfigs..preprocessLoaderJs"></a>

### webpackConfigs~preprocessLoaderJs(dotenv) ⇒ <code>Object</code>
Assumption based preprocess loader for JS

**Kind**: inner method of [<code>webpackConfigs</code>](#module_webpackConfigs)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>dotenv</td><td><code>object</code></td>
    </tr><tr>
    <td>dotenv._BUILD_SRC_DIR</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpackConfigs..preprocessLoaderTs"></a>

### webpackConfigs~preprocessLoaderTs(dotenv) ⇒ <code>Object</code>
Assumption based preprocess loader for Typescript

**Kind**: inner method of [<code>webpackConfigs</code>](#module_webpackConfigs)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>dotenv</td><td><code>object</code></td>
    </tr><tr>
    <td>dotenv._BUILD_SRC_DIR</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpackConfigs..preprocessLoaderNone"></a>

### webpackConfigs~preprocessLoaderNone() ⇒ <code>Object</code>
Assumption based preprocess loader for none

**Kind**: inner method of [<code>webpackConfigs</code>](#module_webpackConfigs)  
<a name="module_webpackConfigs..preprocessLoader"></a>

### webpackConfigs~preprocessLoader(options) ⇒ <code>Object</code>
Assumption based preprocess loader

**Kind**: inner method of [<code>webpackConfigs</code>](#module_webpackConfigs)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.loader</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpackConfigs..common"></a>

### webpackConfigs~common(dotenv) ⇒ <code>Object</code>
Common webpack settings between environments.

**Kind**: inner method of [<code>webpackConfigs</code>](#module_webpackConfigs)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>dotenv</td><td><code>object</code></td>
    </tr><tr>
    <td>dotenv._BUILD_APP_INDEX_PREFIX</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_DIST_DIR</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_HTML_INDEX_DIR</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_PUBLIC_PATH</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_RELATIVE_DIRNAME</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_SRC_DIR</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_STATIC_DIR</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_UI_NAME</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpackConfigs..development"></a>

### webpackConfigs~development(dotenv) ⇒ <code>Object</code>
Development webpack configuration.

**Kind**: inner method of [<code>webpackConfigs</code>](#module_webpackConfigs)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>dotenv</td><td><code>object</code></td>
    </tr><tr>
    <td>dotenv.NODE_ENV</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_DIST_DIR</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_HOST</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_HTML_INDEX_DIR</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_OPEN_PATH</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_RELATIVE_DIRNAME</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_PORT</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_SRC_DIR</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_STATIC_DIR</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_webpackConfigs..production"></a>

### webpackConfigs~production(dotenv) ⇒ <code>Object</code>
Production webpack configuration.

**Kind**: inner method of [<code>webpackConfigs</code>](#module_webpackConfigs)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>dotenv</td><td><code>object</code></td>
    </tr><tr>
    <td>dotenv.NODE_ENV</td><td><code>string</code></td>
    </tr><tr>
    <td>dotenv._BUILD_RELATIVE_DIRNAME</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

