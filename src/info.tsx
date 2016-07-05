import * as React from 'react'

import User from './models/user'
import Repository from './models/repository'

interface InfoProps {
  selectedRepo: Repository,
  user: User
}

interface InfoState {

}

export default class Info extends React.Component<InfoProps, InfoState> {
  private renderNoSelection() {
    return (
      <div>
        <div>No repo selected!</div>
      </div>
    )
  }

  public render() {
    const repo = this.props.selectedRepo
    if (!repo) {
      return this.renderNoSelection()
    }

    return (
      <div>{repo.getPath()}</div>
    )
  }
}