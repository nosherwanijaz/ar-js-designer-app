import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import '@grapecity/activereports/styles/ar-js-ui.css';
import '@grapecity/activereports/styles/ar-js-viewer.css';
import '@grapecity/activereports/styles/ar-js-designer.css';
import {
  Designer as ReportDesigner,
  templates,
} from '@grapecity/activereports/reportdesigner';
import { Viewer as ReportViewer } from '@grapecity/activereports-react';
import { PageReport } from '@grapecity/activereports/core';
import { exportDocument as PdfExport } from '@grapecity/activereports/pdfexport';

function App() {
  const designer = React.useRef();
  const currentResolveFn = React.useRef();
  const viewer = React.useRef();
  const [designerVisible, setDesignerVisible] = React.useState(true);
  const counter = React.useRef(0);
  const [reportStorage, setReportStorage] = React.useState(new Map());
  function onDesignerOpen() {
    setDesignerVisible(true);
  }

  async function onPdfPreview() {
    const reportInfo = await designer.current.getReport();
    const report = new PageReport();
    await report.load(reportInfo.definition);
    const doc = await report.run();
    const result = await PdfExport(doc);
    result.download('exportedreport.pdf');
  }

  React.useEffect(() => {
    designer.current = new ReportDesigner('#designer-host');
    designer.current.setActionHandlers({
      onRender: (report) => {
        setDesignerVisible(false);
        viewer.current.open(report.definition);
        return Promise.resolve();
      },
      onCreate: function () {
        const reportId = `NewReport${++counter.current}`;
        return Promise.resolve({
          definition: templates.CPL,
          id: reportId,
          displayName: reportId,
        });
      },
      onOpen: function () {
        const ret = new Promise(function (resolve) {
          currentResolveFn.current = resolve;
          window.$('#dlgOpen').modal('show');
        });
        return ret;
      },
      onSave: function (info) {
        const reportId = info.id || `NewReport${++counter.current}`;
        setReportStorage(new Map(reportStorage.set(reportId, info.definition)));
        return Promise.resolve({ displayName: reportId });
      },
      onSaveAs: function (info) {
        const reportId = `NewReport${++counter.current}`;
        setReportStorage(new Map(reportStorage.set(reportId, info.definition)));
        return Promise.resolve({ id: reportId, displayName: reportId });
      },
    });
    designer.current.setReport({
      id: './Summons_CourtAppearanceRequired_narrow.rdlx-json',
    });
  }, []);
  return (
    <Fragment>
      <div id='designer-toolbar' class='container-fluid'>
        <div class='row mt-3 mb-3'>
          {designerVisible && (
            <button
              type='button'
              class='btn btn-primary btn-sm col-sm-2 ml-1'
              onClick={() => onPdfPreview()}
            >
              PDF Preview
            </button>
          )}
          {!designerVisible && (
            <button
              type='button'
              class='btn btn-primary btn-sm col-sm-2 ml-1'
              onClick={() => onDesignerOpen()}
            >
              Open Designer
            </button>
          )}
        </div>
      </div>
      <div
        id='designer-host'
        style={{ display: designerVisible ? 'block' : 'none' }}
      ></div>
      {!designerVisible && (
        <div id='viewer-host'>
          <ReportViewer ref={viewer} />
        </div>
      )}
    </Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
