import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.PureComponent {
    componentDidMount() {
        if (this.props.has_fixed_header) {
            window.addEventListener('resize', this.updateFixedHeaderWidth, false);
            this.updateFixedHeaderWidth();
        }
    }

    componentDidUpdate() {
        // adding data can cause scrollbar to appear, window resize is not triggered in this case
        this.updateFixedHeaderWidth();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateFixedHeaderWidth, false);
    }

    updateFixedHeaderWidth = () => {
        // header is fixed to viewport and is taken out of normal DOM flow
        // table doesn't have a fixed width -> we need to check it manually and react to changes
        if (this.el_fixed_header && this.el_container) {
            this.el_fixed_header.style.width = `${this.el_container.offsetWidth}px`;
        }
    }

    renderRow(row_obj, is_footer = false, id = 0) {
        if (!row_obj) return null;

        return (
            <tr className='table-row' key={id}>
                {this.props.columns.map(({ col_index, renderCellContent }) => {
                    const cell_value = row_obj[col_index] || '';

                    return (
                        <td className={col_index} key={col_index}>
                            {renderCellContent
                                ? renderCellContent({ cell_value, col_index, row_obj, is_footer })
                                : cell_value
                            }
                        </td>
                    );
                })}
            </tr>
        );
    }

    renderBodyRows() {
        return this.props.data_source
            .map((row_obj, id) => this.renderRow(row_obj, false, id));
    }

    renderHeaders() {
        return this.props.columns.map(col => <th className={col.col_index} key={col.col_index}>{col.title}</th>);
    }

    renderTableClone() {
        /*
            cloned table with one row for fixed header
            inspired by
            https://stackoverflow.com/questions/4709390
        */
        return (
            <table className='table table-clone' ref={el => { this.el_fixed_header = el; }}>
                <thead className='table-head'>
                    <tr className='table-row'>
                        {this.renderHeaders()}
                    </tr>
                </thead>

                <tbody className='table-body'>
                    {this.renderRow(this.props.data_source[0])}
                </tbody>
            </table>
        );
    }

    render() {
        const table_class = classNames('table', {
            'table--fixed-header': this.props.has_fixed_header,
        });
        return (
            <div className='table-container' ref={el => { this.el_container = el; }}>
                {this.props.has_fixed_header && this.renderTableClone()}

                <table className={table_class}>
                    <thead className='table-head'>
                        <tr className='table-row'>
                            {this.renderHeaders()}
                        </tr>
                    </thead>

                    {this.props.footer &&
                        <tfoot className='table-foot'>
                            {this.renderRow(this.props.footer, true)}
                        </tfoot>
                    }

                    <tbody className='table-body'>
                        {this.renderBodyRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

DataTable.propTypes = {
    columns         : PropTypes.array,
    data_source     : MobxPropTypes.arrayOrObservableArray,
    footer          : PropTypes.object,
    has_fixed_header: PropTypes.bool,
};



export default DataTable;
