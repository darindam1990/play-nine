const Header = (props) => {
	return (
  	<div className='header'>
  	  <h2>Play Nine</h2>
  	</div>
  );
};

const Message = (props) => {
	const getFailStyle = () => {
  	return (typeof(props) === 'boolean' && !props.isWon) ? 'block' : 'none';
  }
  const getSuccessStyle = () => {
  	return (props.isWon) ? 'block' : 'none';
  }
	return (
  	<p>
  	<div style={{ display: getSuccessStyle() }}>
  		<h2>You won!</h2>
  		<a class="btn">Play Again</a>
  	</div>
  	<div style={{ display: getFailStyle() }}>
  		<h2>You lost!</h2>
  		<a class="btn">Retry</a>
  	</div>
    </p>
  );
};

const Container = (props) => {
	return (
  	<div className="game-ct">
    	<div className="top-row">
  	  	<Stars starCount={props.starCount} />
        <div style={{ flex: 1.5, display: 'flex' }}>
          <Controls style={{ flex: 1 }} hasMatch={props.hasMatch} resetAfterMatch={props.resetAfterMatch} retry={props.retry} lives={props.lives} used={props.used}/>
          <Moves style={{ flex: 3 }} used={props.used} onNumClick={props.onNumClick}/>
        </div>
      </div>
      <div>
        <NumberPad isNumUsed={props.isNumUsed} onNumClick={props.onNumClick}/>
      </div>
  	</div>
  );
};

const Stars = (props) => {
	return (
  	<div className="stars-ct">
  		{
      [...Array(props.starCount)].map(() => <span className='star'>&#9733;</span>)
      }
    </div>
  );
};

class Controls extends React.Component {
	state = {
  	btnState: 0
  }
  
  getCfg() {
  	switch (this.state.btnState) {
    	case 0: return {
      	style: {backgroundColor: 'grey'},
        text: '='
      }
      case 1: return {
      	style: {backgroundColor: 'green'},
        text: '\u2714'
      }
      case 2: return {
      	style: {backgroundColor: 'red'},
        text: '\u2715'
      }
    }
  }
  
	moveClick = () => {
  	if (this.state.btnState === 0 && this.props.used.length) {
    	this.setState({btnState: this.props.hasMatch() ? 1 : 2});
    } else if (this.state.btnState === 1) {
    	this.setState({btnState: 0});
    	this.props.resetAfterMatch();
    } else {
    	this.setState({btnState: 0});
    }
  }
  
  retryClick = () => {
  	this.props.retry();
  }
  
  render() {
  	const cfg = this.getCfg();
  	return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
    	<button style={cfg.style} className='action' onClick={this.moveClick}>{cfg.text}</button>
      <button className='retry' onClick={this.retryClick}>{this.props.lives}</button>
    </div>
    );
  }
}

const Moves = (props) => {
	return (
    	<div className='moves-ct'>
      	{
    	  	props.used.map((o) => <Number onNumClick={props.onNumClick} key={o} value={o} append={false}/>)
        }
      </div>
    );
}

const NumberPad = (props) => {
	return (
    	<div className='num-ct'>
      	{
    	  	[...Array(9)].map((o,i) => <Number onNumClick={props.onNumClick} key={i+1} append={true} isNumUsed={props.isNumUsed} value={i+1} />)
        }
    	</div>
    );
}

class Number extends React.Component {
  handleClick = (event) => {
  	this.props.onNumClick(this.props.value, this.props.append);
  }
  
  getStyle = (value) => {
  	return {
  			backgroundColor: this.props.isNumUsed && this.props.isNumUsed(value) ? 'green' : 'grey',
  			pointerEvents: this.props.isNumUsed && this.props.isNumUsed(value) ? 'none' : 'all'
  		}
  }
  
	render() {
  	return <span style={this.getStyle(this.props.value)} className='num' onClick={this.handleClick}>{this.props.value}</span>;
  }
}

class App extends React.Component {
	state = {
  	lives: 5,
    starCount: Math.floor(Math.random() * 9) + 1,
    used: [],
    shelved: [],
    isWon: null
  }
  
  onNumClick = (value, append = true) => {
  	if (append) {
    	this.setState({used: this.state.used.concat(value)});
    } else {
    	const idx = this.state.used.findIndex(o => o === value);
    	this.setState({used: this.state.used.slice(0, idx).concat(this.state.used.slice(idx+1))})
    }
  }
  
  isNumUsed = (value) => {
  	return this.state.shelved.includes(value) || this.state.used.includes(value);
  }
  
  resetAfterMatch = () => {
  	this.setState({
    	shelved: this.state.shelved.concat(this.state.used.slice()),
      used: [],
    	starCount: Math.floor(Math.random() * 9) + 1
    });
    setTimeout(() => {
    	this.checkGameState();
    }, 0);
  }
  
  retry = () => {
  	this.setState({
  		starCount: Math.floor(Math.random() * 9) + 1,
  		lives: this.state.lives - 1
  	});
     setTimeout(() => {
    	this.checkGameState();
    }, 0);
  }
  
  hasMatch = () => {
  	return this.state.used.length ? (this.state.used.reduce((a,b) => a+b) === this.state.starCount) : false;
  }
  
  checkGameState = () => {
  	// debugger;
  	if (this.state.lives === 0 && !this.possibleCombinationSum(this.getUnusedNumbers(), this.state.starCount) ) {
    	alert('Lost');
      this.setSate({
      	isWon: false
      });
    }
    if (this.state.shelved.length === 9) {
    	alert('Won');
      this.setSate({
      	isWon: true
      });
    }
  }
  
  getUnusedNumbers = () => {
  	const allNums = [...Array(9)].map((o,i) => i+1);
    return allNums.filter(i => !this.state.shelved.includes(i));
  }
  
  possibleCombinationSum = (arr, n) => {
  	if (arr.indexOf(n) >= 0) {
    	return true;
    }
  	if (arr[0] > n) {
    	return false;
    }
  	if (arr[arr.length - 1] > n) {
    	arr.pop();
    	return possibleCombinationSum(arr, n);
  	}
  	const listSize = arr.length, combinationsCount = (1 << listSize)
  	for (let i = 1; i < combinationsCount ; i++ ) {
    	let combinationSum = 0;
    	for (var j=0 ; j < listSize ; j++) {
      	if (i & (1 << j)) { combinationSum += arr[j]; }
    	}
    	if (n === combinationSum) { 
      	return true;
      }
  	}
  	return false;
	}
  
  reset = () => {
  	this.setState({
  		lives: 5,
    	starCount: Math.floor(Math.random() * 9) + 1,
    	used: [],
    	shelved: [],
      isWon: null
  	});
  }
  
	render() {
		return (
    	<div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
  			<Header />
      	<Container
        	starCount={this.state.starCount}
          onNumClick={this.onNumClick}
          isNumUsed={this.isNumUsed}
          used={this.state.used}
          hasMatch={this.hasMatch}
          resetAfterMatch={this.resetAfterMatch}
          retry={this.retry}
          lives={this.state.lives}
        />
        <Message isWon={this.state.isWon} />
      </div>
  	);
	}
}

ReactDOM.render(<App />, mountNode);