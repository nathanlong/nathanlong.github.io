// DYNAMIC MODULES/COMPONENTS
// select every "data-module" and convert the NodeList to an Array
const dataModules = [...document.querySelectorAll('[data-module]')]

// store all instances to clean up during HMR (hot module replacement)
const storage = {}

dataModules.forEach((element) => {
  element.dataset.module.split(' ').forEach(function (moduleName) {
    // dynamic imports help with code splitting
    import(
      // assumes modules are in directory `.src/modules/<module-name>.js`
      // and your entry point lives in `.src/<entry-point-file>.js
      `./modules/${moduleName}.js`
    ).then((Module) => {
      // create a new instance of our module passing the element and store it
      storage[moduleName] = new Module.default(element)
    })
  })
})
