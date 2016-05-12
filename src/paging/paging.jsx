import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';

const pageButtonStyle = {
  minWidth: 42,
  margin: 5
};

const jumpBtnLabelStyle = {
  padding: '0 5px'
};

const PAGE_SIZE = 5;

class Paging extends React.Component {
  constructor() {
    super();
    this.gotoFirst = this.gotoFirst.bind(this);
    this.gotoLast = this.gotoLast.bind(this);
    this.gotoPre = this.gotoPre.bind(this);
    this.gotoPrePage = this.gotoPrePage.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoNextPage = this.gotoNextPage.bind(this);
    this.goto = this.goto.bind(this);
    
    this.onJump = this.onJump.bind(this);
    this.onJumpValueChange = this.onJumpValueChange.bind(this);
    
    this.totalPage = 0;
    
    this.state = {
      
    };
  }

  gotoFirst() {
    this.props.info.index = 0;
    this.goto();
  }

  gotoLast() {
    this.props.info.index = this.totalPage - 1;
    this.goto();
  }

  gotoPre() {
    this.props.info.index--;
    if(this.props.info.index < 0) {
      this.props.info.index = 0;
      return;
    }
    this.goto();
  }

  gotoPrePage() {
    this.props.info.index -= PAGE_SIZE;
    if(this.props.info.index < 0) {
      this.props.info.index = 0;
    }
    this.goto();
  }

  gotoNext() {
    this.props.info.index++;
    if(this.props.info.index >= this.totalPage) {
      this.props.info.index = this.totalPage - 1;
      return;
    }
    this.goto();
  }

  gotoNextPage() {
    this.props.info.index += PAGE_SIZE;
    this.goto();
  }

  goto() {
    this.props.handleClick();
    
    this.setState({
      ts: +new Date()
    });
  }
  
  onJump() {
    let value = +this.state.jumpValue;
    if(value > 0 && value <= this.totalPage) {
      this.props.info.index = value - 1;
      this.goto();
    } else {
      this.context.showToast('不合法的页码');
    }
  }
  
  onJumpValueChange(ev) {
    this.setState({
      jumpValue: ev.target.value
    });
  }

  render() {
    let totalArray = [];
    let total;
    let start;
    
    this.totalPage = Math.ceil(this.props.info.total / this.props.info.pagesize); 
    
    total = this.props.info.index + PAGE_SIZE;
    total = total < this.totalPage ? total : this.totalPage;
    start = this.totalPage - this.props.info.index;
    if(this.totalPage < PAGE_SIZE) {
      start = 0;
    } else {
      start = start < PAGE_SIZE ? this.totalPage - PAGE_SIZE : this.props.info.index;
    }

    if(this.totalPage > 1) {
      totalArray.push({
        label: '<<',
        onClick: this.gotoFirst
      });
      totalArray.push({
        label: '<',
        onClick: this.gotoPre
      });
      if(start > 0) {
        totalArray.push({
          label: '...',
          onClick: this.gotoPrePage
        });
      }
      for (let i = start + 1; i <= total; i++) {
        totalArray.push({
          label: i,
          onClick: (() => {
            return () => {
              this.props.info.index = i - 1;
              this.goto();
            }
          })()
        });
      }
      if(this.props.info.index + PAGE_SIZE < this.totalPage) {
        totalArray.push({
          label: '...',
          onClick: this.gotoNextPage
        });
      }
      totalArray.push({
        label: '>',
        onClick: this.gotoNext
      });
      totalArray.push({
        label: '>>',
        onClick: this.gotoLast
      });
    } else {
      return <div></div>
    }

    return (
      <div className='row pdl1 pdr1 center-xs middle-xs mgb1 mgt1'>
        {
          totalArray.map((t, i) => {
            if (t.label === this.props.info.index + 1) {
              return <RaisedButton key={i}
                                   label={t.label}
                                   secondary={true}
                                   onClick={ t.onClick }
                                   style={pageButtonStyle}/>
            }

            return <FlatButton key={i}
                               label={t.label}
                               secondary={true}
                               onClick={ t.onClick }
                               style={pageButtonStyle}/>
          })
        }
        <span>{'共' + this.totalPage + '页，'}</span>
        <input className='pagenum_input' type='text' value={this.state.jumpValue} onChange={this.onJumpValueChange}/>
        <FlatButton label='前往'
                    secondary={true}
                    onClick={this.onJump}
                    style={pageButtonStyle}
                    labelStyle={jumpBtnLabelStyle}/>
      </div>
    )
  }
}

Paging.contextTypes = {
  showToast: React.PropTypes.func
};


export default Paging;