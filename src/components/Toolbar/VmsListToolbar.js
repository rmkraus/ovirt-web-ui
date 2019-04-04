import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { connect } from 'react-redux'
import AddVmButton from '../VmDialog/AddVmButton'
import VmFilter from '../VmFilters'
import VmSort from '../VmSort'
import { Toolbar, Filter } from 'patternfly-react'
import { filterVms, mapFilterValues } from '_/utils'
import { RouterPropTypeShapes } from '_/propTypeShapes'
import { removeFilter, clearFilters } from '_/actions'
import { msg } from '_/intl'
import style from './style.css'

const VmsListToolbar = ({ match, vms, onRemoveFilter, onClearFilters }) => {
  const filters = vms.get('filters').toJS()

  const mapLabels = (item, index) => {
    const labels = []
    if (List.isList(item)) {
      item.forEach((t, i) => {
        labels.push(<Filter.Item
          key={i}
          onRemove={onRemoveFilter}
          filterData={{ value: t, id: index }}
        >
          {msg[index]()}: {mapFilterValues[index](t)}
        </Filter.Item>)
      })
    } else {
      labels.push(<Filter.Item
        key={index}
        onRemove={onRemoveFilter}
        filterData={{ value: item, id: index }}
      >
        {msg[index]()}: {mapFilterValues[index](item)}
      </Filter.Item>)
    }
    return labels
  }
  const total = vms.get('vms').size + vms.get('pools').size
  const available = vms.get('filters').size &&
    vms.get('vms').filter(vm => filterVms(vm, filters)).size +
    vms.get('pools').filter(vm => filterVms(vm, filters)).size
  return (
    <Toolbar className={style['full-width']}>
      <VmFilter />
      <VmSort />
      <Toolbar.RightContent>
        <AddVmButton key='addbutton' id='route-add-vm' />
      </Toolbar.RightContent>
      <Toolbar.Results>
        <h5>
          {
            vms.get('filters').size
              ? msg.resultsOf({ total, available })
              : msg.results({ total })
          }
        </h5>
        { vms.get('filters').size > 0 &&
          <React.Fragment>
            <Filter.ActiveLabel>{msg.activeFilters()}</Filter.ActiveLabel>
            <Filter.List>
              {[].concat(...vms.get('filters').map(mapLabels).toList().toJS())}
            </Filter.List>
            <a
              href='#'
              onClick={e => {
                e.preventDefault()
                onClearFilters()
              }}
            >
              {msg.clearAllFilters()}
            </a>
          </React.Fragment>
        }
      </Toolbar.Results>
    </Toolbar>)
}

VmsListToolbar.propTypes = {
  vms: PropTypes.object.isRequired,

  match: RouterPropTypeShapes.match.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    vms: state.vms,
  }),
  (dispatch) => ({
    onRemoveFilter: (filter) => dispatch(removeFilter({ filter })),
    onClearFilters: () => dispatch(clearFilters()),
  })
)(VmsListToolbar)
