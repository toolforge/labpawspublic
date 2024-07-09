import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the labpawspublic extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'labpawspublic:plugin',
  description: 'jupyterlab extension to add paws-public links',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension labpawspublic is activated!');
  }
};

export default plugin;
