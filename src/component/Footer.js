import React from 'react'

export default function Footer(props) {
  return (
    <footer className='footer'>
      <div className='content' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <div>
          Copyright {new Date().getFullYear()} Godspeed. All rights reserverd.
        </div>
        <div className={this.state.focusMode ? 'has-text-weight-bold is-size-5 invisible' : 'has-text-weight-bold is-size-5'} style={{width: '240px'}}>
          <div>{this.state.slider} minutes</div>
          <Slider onChange={this.onChangeSliderValue} val={this.state.slider} min='5' max='90' step='1' />
        </div>
        <div>
          <button onClick={this.toggleTheme} className='button btn-circle theme' style={{ marginRight: '1rem' }}></button>
          <a className={this.state.focusMode ? 'icon button theme hide' : 'icon button theme'} href='#' style={{color: '#ffffff', backgroundColor: '#212529'}}>
            <i className='ion-ionic ion-md-help'></i>
          </a>
        </div>
      </div>
    </footer>
  )
}