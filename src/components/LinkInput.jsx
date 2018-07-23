import React, {Component} from 'react';
const audioQualities = require('../../audio.qualities');

class LinkInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      showError: false
    };

    this.updateInputValue = this.updateInputValue.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.startDownload = this.startDownload.bind(this);
    this.getIdFromUrl = this.getIdFromUrl.bind(this);
  }

  getIdFromUrl(url) {
    let id = '';
    let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return null;
    }
  }

  updateInputValue(e) {
    this.setState({
      inputValue: e.target.value,
      showError: false
    });
  }

  checkEnter(e) {
    if (e.keyCode === 13) {
      this.startDownload();
    }
  }

  startDownload() {
    let id = this.getIdFromUrl(this.state.inputValue);
    if (id === null) {
      this.setState({
        showError: true
      });
    } else {
      this.props.startDownload(id);
    }
  }

  render() {
    let className = `link__input${this.state.showError ? '--error' : ''}`;
    return <div>
      <input className={className} onChange={this.updateInputValue} onKeyDown={this.checkEnter}
             placeholder='Url de la vidéo'/>
      <div className='center'>
        <button className='link__button' onClick={this.startDownload}>Convertir en .mp3</button>
      </div>
      <div className='center'>
        <span className='link__info'>Qualité: {audioQualities[this.props.bitRate].label}</span>
      </div>
    <div className='center'>
      <span className='link__info'>Dossier de téléchargement: {this.props.userDownloadsFolder}</span>
    </div>
    </div>;
  }
}

export default LinkInput;
