import React, {PropTypes} from 'react';
import { Button, Input } from 'react-bootstrap';

import ObjectUtils from 'util/ObjectUtils';

/**
 * KVTable displays a table for all key-value pairs in a JS object. If the editable prop is set to true, it also
 * provides inputs to create, edit and delete key-value pairs.
 */
const KVTable = React.createClass({
  propTypes: {
    pairs: PropTypes.object.isRequired, // Object containing key-values to represent in the table
    headers: PropTypes.array, // Table headers. Must be an array with three elements [ key header, value header, actions header]
    editable: PropTypes.bool, // Indicates if the user can create, edit or delete key-value pairs
    onChange: PropTypes.func, // Callback when key-value pairs change
    className: PropTypes.string, // Extra CSS classes for the rendered table
    containerClassName: PropTypes.string, // Extra CSS classes for the table container
    actionsSize: PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']), // Size of action buttons
  },

  getInitialState() {
    return {
      newKey: '',
      newValue: '',
    };
  },

  getDefaultProps() {
    return {
      headers: ['Name', 'Value', 'Actions'],
      editable: false,
      actionsSize: 'xsmall',
      className: '',
      containerClassName: '',
    };
  },

  _onPairsChange(newPairs) {
    if (this.props.onChange) {
      this.props.onChange(newPairs);
    }
  },

  _bindValue(event) {
    const newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  },

  _addRow() {
    const newPairs = ObjectUtils.clone(this.props.pairs);
    newPairs[this.state.newKey] = this.state.newValue;
    this._onPairsChange(newPairs);

    this.setState({newKey: '', newValue: ''});
  },

  _deleteRow(key) {
    return () => {
      if (window.confirm(`Are you sure you want to delete property '${key}'?`)) {
        const newPairs = ObjectUtils.clone(this.props.pairs);
        delete newPairs[key];
        this._onPairsChange(newPairs);
      }
    };
  },

  _formattedHeaders(headers) {
    return (
      <tr>
        {headers.map((header, idx) => {
          const style = {};

          // Hide last column or apply width so it sticks to the right
          if (idx === headers.length - 1) {
            if (!this.props.editable) {
              return null;
            }

            style.width = 75;
          }

          return <th key={header} style={style}>{header}</th>;
        })}
      </tr>
    );
  },

  _formattedRows(pairs) {
    return Object.keys(pairs).sort().map(key => {
      let actionsColumn;
      if (this.props.editable) {
        const actions = [];
        actions.push(
          <Button key={`delete-${key}`} bsStyle="danger" bsSize={this.props.actionsSize} onClick={this._deleteRow(key)}>
            Delete
          </Button>
        );

        actionsColumn = <td>{actions}</td>;
      }

      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{pairs[key]}</td>
          {actionsColumn}
        </tr>
      );
    });
  },

  _newRow() {
    if (!this.props.editable) {
      return null;
    }

    const addRowDisabled = !this.state.newKey || !this.state.newValue;
    return (
      <tr>
        <td>
          <Input type="text" name="newKey" id="newKey" bsSize="small" placeholder={this.props.headers[0]} value={this.state.newKey}
                 onChange={this._bindValue}/>
        </td>
        <td>
          <Input type="text" name="newValue" id="newValue" bsSize="small" placeholder={this.props.headers[1]}
                 value={this.state.newValue} onChange={this._bindValue}/>
        </td>
        <td>
          <Button bsStyle="success" bsSize="small" onClick={this._addRow} disabled={addRowDisabled}>Add</Button>
        </td>
      </tr>
    );
  },

  render() {
    return (
      <div>
        <div className={`table-responsive ${this.props.containerClassName}`}>
          <table className={`table table-striped ${this.props.className}`}>
            <thead>{this._formattedHeaders(this.props.headers)}</thead>
            <tbody>
            {this._formattedRows(this.props.pairs)}
            {this._newRow()}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});

export default KVTable;
