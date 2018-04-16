import { DateTime } from 'luxon'
import React, { Component } from 'react'

import { Popup, Accordion, List, Header, Icon, Divider, Button, Form, Message } from 'semantic-ui-react'

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
  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  submit = () => {
    const start = new Date(this.state.start)
    const fin = this.state.fin ? new Date(this.state.fin) : null
    // date validation
    const isValid = (date) => date instanceof Date && !isNaN(date.valueOf())
    if (isValid(start) && (!fin || isValid(fin))) {
      console.log(start, fin);
    }
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
          ? <Button icon='edit' content='Редактировать' floated='right' onClick={this.toggleEdit} />
          : <Form>
              <Form.Input name='start' label='Начало' type='datetime-local'
                onChange={this.handleChange} value={start}/>
              { work.fin &&
                <Form.Input name='fin' label='Окончание' type='datetime-local'
                  onChange={this.handleChange} value={fin}/>
              }
              <Button icon='checkmark' content='Сохранить' floated='right' onClick={this.submit} />
              <Button icon='remove' content='Отмена' floated='right' onClick={this.cancel} />
            </Form>
        }
      </Popup>
    )
  }
}

export default WorkPopup
