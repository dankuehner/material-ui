import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class BreadTypeAdmin extends React.Component {
	render() {
		return (
			<Box m={2}>
				<Typography variant="h5" component="h5" gutterBottom>
					Types of Bread
				</Typography>
				<form>
					<BreadTypeList breadTypes={this.props.breadTypes} onDropBreadType={this.props.onDropBreadType} />
					<AddNewBread onNewBreadType={this.props.onAddNewBreadType} />
				</form>
			</Box>
		);
	}
}

class BreadTypeList extends React.Component {
	render() {
		return (
			<Grid container spacing={1} m={2}>
				{this.props.breadTypes.map((breadName) =>
					<BreadTypeListItem key={breadName} breadName={breadName} onDropBreadType={this.props.onDropBreadType} />
				)}
			</Grid>
		);
	}
}

class BreadTypeListItem extends React.Component {
	constructor(props) {
		super(props);

		this.handleDropClick = this.handleDropClick.bind(this);
	}
	
	handleDropClick() {
		this.props.onDropBreadType(this.props.breadName);
	}
	
	render() {
		return (
			<Grid item xs={12}>
				{this.props.breadName} 
				<Button variant="contained" size="small" onClick={this.handleDropClick}>- DROP</Button>
			</Grid>
		);
	}
}

class AddNewBread extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange() {
		this.setState({value: event.target.value});
	}

	handleClick() {
		if (this.state.value === '') return;

		this.props.onNewBreadType(this.state.value);
		this.setState({value: ''});
	}

	render() {
		return (
			<Box m={1}>
				<TextField id="standard-basic" label="New Bread Type" value={this.state.value} onChange={this.handleChange}/>
				<Button variant="contained" size="small" onClick={this.handleClick}>+ ADD</Button>
			</Box>
		);
	}
}

export default BreadTypeAdmin;
