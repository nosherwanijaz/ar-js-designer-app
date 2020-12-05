import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { saveAs } from 'file-saver';
import { FilePicker } from 'react-file-picker';
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

const REPORTS_ROOT = 'reports';

function App() {
  const path = require('path');
  const designer = React.useRef();
  const viewer = React.useRef();
  const [designerVisible, setDesignerVisible] = React.useState(true);
  const counter = React.useRef(1);
  const [reportStorage, setReportStorage] = React.useState(new Map());
  function onDesignerOpen() {
    setDesignerVisible(true);
  }
  function onLoadBlank(fpl) {
    designer.current.setReport({
      definition: fpl ? templates.FPL : templates.CPL,
    });
  }

  async function onPdfPreview() {
    const reportInfo = await designer.current.getReport();
    const report = new PageReport();
    await report.load(reportInfo.definition);
    const doc = await report.run();
    const result = await PdfExport(doc);
    result.download('exportedreport.pdf');
  }

  async function exportReport() {
    const reportInfo = await designer.current.getReport();
    var blob = new Blob([JSON.stringify(reportInfo.definition)], {
      type: 'application/json',
    });
    let baseName = path.basename(reportInfo.id, '.rdlx-json');
    let fileName = `${baseName} ${counter.current++}.rdlx-json`;
    saveAs(blob, fileName);
  }

  React.useEffect(() => {
    designer.current = new ReportDesigner('#designer-host');
    designer.current.setActionHandlers({
      onCreate: function () {
        return Promise.resolve();
      },
      onRender: (report) => {
        setDesignerVisible(false);
        viewer.current.open(report.definition);
        return Promise.resolve();
      },
      onSave: function (info) {
        const reportId = info.id;
        setReportStorage({
          ...reportStorage,
          reportId: reportId,
          reportDefinition: info.definition,
        });
        return Promise.resolve({ displayName: reportId });
      },
    });
  }, []);

  return (
    <Fragment>
      <div id='designer-toolbar' className='container-fluid'>
        <div className='row mt-3 mb-3'>
          {designerVisible && (
            <div style={{ width: '100%' }}>
              <button
                type='button'
                class='btn btn-primary btn-sm col-sm-2 ml-1'
                onClick={() => onLoadBlank(false)}
              >
                Load Blank RDL
              </button>

              <button
                type='button'
                class='btn btn-secondary btn-sm col-sm-2 ml-1'
                onClick={() => onLoadBlank(true)}
              >
                Load Blank FPL
              </button>
              <FilePicker
                extensions={['rdlx-json']}
                onChange={(FileObject) => {
                  console.log(path.join(REPORTS_ROOT, FileObject.name));
                  designer.current.setReport({
                    id: path.join(REPORTS_ROOT, FileObject.name),
                  });
                }}
                onError={(errMsg) => console.log(errMsg)}
              >
                <button className='btn btn-primary btn-sm col-sm-2 ml-1'>
                  Load Report
                </button>
              </FilePicker>
              <button
                type='button'
                className='btn btn-primary btn-sm col-sm-2 ml-1'
                onClick={() => exportReport()}
              >
                Export Report
              </button>
              <button
                type='button'
                className='btn btn-primary btn-sm col-sm-2 ml-1'
                onClick={() => onPdfPreview()}
              >
                PDF Preview
              </button>
            </div>
          )}
          {!designerVisible && (
            <button
              type='button'
              className='btn btn-primary btn-sm col-sm-2 ml-1'
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
