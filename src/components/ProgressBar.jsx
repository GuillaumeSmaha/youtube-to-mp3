import React, {Component} from 'react';

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.startDownload = this.startDownload.bind(this);
  }

  startDownload() {
    this.props.startDownload(this.props.currentId);
  }

  render() {
    let percentComplete = `${this.props.progress}%`;
    let messageToShow = `${this.props.messageText}`;
    let color = '#747373';

    if (this.props.progress > 90) {
      color = 'white';
    }

    let classNameError = this.props.showProgressError ? '' : 'hidden';
    return <div className='progess_block'>
      <div className='progress'>
        <div className='progress__bar' style={{'width': percentComplete}}></div>
        <div className='progress__percentage' style={{'color': color}}>{percentComplete}</div>
      </div>
      <div className='center'>
        <span className='progress__info'>{messageToShow}</span>
      </div>
      <div className={classNameError}>
        <div className='center'>
          <span className='error'>Oups! Une erreur est survenue!</span>
        </div>
        <div className='center'>
          <button className='progress__button' onClick={this.startDownload}>Ressayer</button>
        </div>
        <div className='center'>
          <span className='error'>{this.props.progressErrorDetails}</span>
        </div>
      </div>
    </div>;
  }
}

export default ProgressBar;
