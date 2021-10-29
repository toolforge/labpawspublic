import { IDisposable } from '@lumino/disposable';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { Clipboard, ToolbarButton } from '@jupyterlab/apputils';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  JupyterLab
} from '@jupyterlab/application';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';

import { pawsPublicLinkIcon } from './icons';

namespace CommandIDs {
  export const shareLink = 'filebrowser:share-main';

  export const publicWidget = 'labpawspublic:publicwidget';
}

class PawsPublicLinkButton
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  constructor(app: JupyterFrontEnd) {
    this.app = app;
  }

  readonly app: JupyterFrontEnd;
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel): IDisposable {
    const button = new ToolbarButton({
      label: 'PAWS public link',
      tooltip: 'PAWS public link',
      icon: pawsPublicLinkIcon,
      onClick: () => {
        const path = panel.context.path;
        const user = JupyterLab.defaultPaths.urls.hubUser;
        window.open(
          `https://public.paws.wmcloud.org/User:${user}/${path}`,
          '_blank'
        );
      }
    });
    panel.toolbar.addItem('pawsPublicLink', button);
    return button;
  }
}

function activate(app: JupyterFrontEnd, factory: IFileBrowserFactory): void {
  const { commands } = app;
  const { tracker } = factory;

  commands.addCommand(CommandIDs.shareLink, {
    execute: () => {
      const widget = tracker.currentWidget;
      if (!widget) {
        return;
      }
      const path = encodeURI(widget.selectedItems().next()?.path || '');
      if (!path) {
        return;
      }
      const user = JupyterLab.defaultPaths.urls.hubUser;
      Clipboard.copyToSystem(
        `https://public.paws.wmcloud.org/User:${user}/${path}`
      );
    },
    isVisible: () =>
      Boolean(
        tracker.currentWidget &&
          Array(tracker.currentWidget.selectedItems()).length === 1
      ),
    iconClass: 'jp-MaterialIcon jp-LinkIcon',
    label: 'Copy PAWS-public Link'
  });

  app.docRegistry.addWidgetExtension('Notebook', new PawsPublicLinkButton(app));
}
const extension: JupyterFrontEndPlugin<void> = {
  activate: activate,
  id: CommandIDs.shareLink,
  requires: [IFileBrowserFactory],
  autoStart: true
};
export default extension;
