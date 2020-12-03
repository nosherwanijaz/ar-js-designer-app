import React from 'react';
import { Designer as ReportDesigner } from '@grapecity/activereports/reportdesigner';
import '@grapecity/activereports/styles/ar-js-ui.css';
import '@grapecity/activereports/styles/ar-js-designer.css';

export const DesignerHost = () => {
  const designerRef = React.useRef();
  const currentResolveFn = React.useRef();
  React.useEffect(() => {
    designerRef.current = new ReportDesigner('#designer-host');
  }, []);

  const onSelectReport = (report) => {
    if (currentResolveFn.current) {
      window.$('#dlgOpen').modal('hide');
      currentResolveFn.current({ id: report });
      currentResolveFn.current = null;
    }
  };

  return (
    <React.Fragment>
      <div id='designer-host'></div>
      <div class='modal' id='dlgOpen' tabindex='-1' aria-hidden='true'>
        <div class='modal-dialog'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h5 class='modal-title' id='exampleModalLabel'>
                Open Report
              </h5>
              <button
                type='button'
                class='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div class='modal-body'>
              <h2>Select Report:</h2>
              <div class='list-group'>
                <button
                  type='button'
                  class='list-group-item list-group-item-action'
                  onClick={() =>
                    onSelectReport('reports/CustomersTable.rdlx-json')
                  }
                >
                  Customers Report
                </button>
                <button
                  type='button'
                  class='list-group-item list-group-item-action'
                  onClick={() => onSelectReport('reports/TaxiDrives.rdlx-json')}
                >
                  Taxi Drives Report
                </button>
              </div>
            </div>
            <div class='modal-footer'>
              <button
                type='button'
                class='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
