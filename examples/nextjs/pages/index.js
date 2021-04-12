import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import BreadTypeAdmin from './BreadTypeAdmin.js';
import OrderAdmin from './OrderAdmin.js';
import OrderCalculator from './OrderCalculator.js';

class BreadBakingCalculator extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			breadTypeList: [],
			orderList: []
		};
		
		this.handleBreadListChange = this.handleBreadListChange.bind(this);
		this.handleOrderListChange = this.handleOrderListChange.bind(this);
	}

	handleBreadListChange(breadList){
		this.setState({breadTypeList: breadList});
	}

	handleOrderListChange(orderList){
		this.setState({orderList: orderList});
	}
	
	render() {
		return (
			<Container>
			  <Box m={1}>
				<Typography variant="h4" component="h1" gutterBottom>
					Bread Baking Calculator
				</Typography>
				<Divider />
				<BreadTypeAdmin onBreadListChange={this.handleBreadListChange} />
				<Divider />
				<OrderAdmin breadTypeList={this.state.breadTypeList} onOrderListChange={this.handleOrderListChange} />
				<Divider />
				<OrderCalculator orderList={this.state.orderList} />
			  </Box>
			</Container>
		);
	}
}

export default BreadBakingCalculator;
