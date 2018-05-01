import { DateTime } from 'luxon'
import React, { Component } from 'react'
import { graphql, compose } from "react-apollo"

import { Popup, Accordion, List, Header, Icon, Divider, Button, Form } from 'semantic-ui-react'

import { editWork } from '../graphql/workQueries'

class WorkPopup extends Component {
  state = {
    open: false,
    // edit section visibility
    edit: false,
    start: DateTime.fromISO(this.props.work.start).toISO().slice(0,16),
    fin: this.props.work.fin && new DateTime.fromISO(this.props.work.fin).toISO().slice(0,16),
  }
  handleOpen = () => this.setState({open: true})
  handleClose = () => {!this.state.edit && this.setState({open: false})}
  toggleEdit = () => this.setState({edit: !this.state.edit})
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }
  edit = () => {
    const start = new Date(this.state.start)
    const fin = this.state.fin ? new Date(this.state.fin) : null
    // date validation
    // TODO move validation to handleChange fn, add form validation
    const isValid = (date) => date instanceof Date && !isNaN(date.valueOf())
    if (isValid(start) && (!fin || isValid(fin))) {
      console.log(start, fin);
      // send request if form has no errors
      this.props.editWork({
        variables: { id: this.props.work.id, start, fin }
      })
      this.setState({edit: false})
    }
  }
  delete = () => {
    this.props.editWork({
      variables: { id: this.props.work.id, delete: true }
    })
    this.setState({edit: false})
  }
  cancel = () => {
    this.setState({edit: false})
  }
  render() {
    const { edit, open, start, fin } = this.state
    const { work, children } = this.props
    return (
      <Popup
        trigger={children}
        open={open}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        position='bottom right'
        flowing
        hoverable
        horizontalOffset={work.time < 1140 ? 19 : 0}
      >
        <Header>
          { !work.fin && <Icon name='setting' loading />}
          <Header.Content>
            {work.workSubType || work.workType} { work.time && `${Math.round(work.time/36)/100}ч` }
            <Header.Subheader>
              {!work.fin && 'с '}{DateTime.fromISO(work.start).toFormat("HH':'mm")}{work.fin && ` - ${DateTime.fromISO(work.fin).toFormat("HH':'mm")}` }
            </Header.Subheader>
          </Header.Content>
        </Header>
        { work.models &&
          <Accordion>
            { work.models.map((model, i) => {
              const { name, article, prods } = model
              return (
                <div key={i} >
                  <Accordion.Title active index={i}>
                    <Header size='tiny'>
                      {name} ( {article} )
                    </Header>
                  </Accordion.Title>
                  <Accordion.Content active>
                    <List size='medium' className='komz-workbar-popup-list'>
                      {prods.map(prod => <List.Item key={prod.id}>{prod.fullnumber}</List.Item>)}
                    </List>
                  </Accordion.Content>
                </div>
              )
            })}
          </Accordion>
        }
        <Divider />
        { !edit
          ? <Button icon='edit' content='Редактировать' floated='right'
              disabled={!fin}
              onClick={this.toggleEdit} />
          : <Form>
              <Form.Input name='start' label='Начало' type='datetime-local'
                onChange={this.handleChange} value={start}/>
              { work.fin &&
                <Form.Input name='fin' label='Окончание' type='datetime-local'
                  onChange={this.handleChange} value={fin}/>
              }

              <Form.Group inline>
                <Button icon='ban' content='Удалить' floated='right' color='red' onClick={this.delete} />
                <Button icon='checkmark' content='Сохранить' floated='right' onClick={this.edit} />
              </Form.Group>
              <Form.Button floated='right' icon='remove' content='Отмена' onClick={this.cancel} />
            </Form>
        }
      </Popup>
    )
  }
}

// export default WorkPopup
export default compose(
    graphql(
        editWork,
        {
            name: 'editWork'
        }
    ),
)(WorkPopup);
