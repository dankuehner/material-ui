import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import BreadTypeAdmin from './BreadTypeAdmin.js';
import OrderAdmin from './OrderAdmin.js';
import OrderCalculator from './OrderCalculator.js';

class BreadBakingCalculator extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			breadTypes: [],
			orders: []
		};
		
		this.onClearAllClick = this.onClearAllClick.bind(this);
		this.addNewBreadType = this.addNewBreadType.bind(this);
		this.dropBreadType = this.dropBreadType.bind(this);
		this.addNewOrder = this.addNewOrder.bind(this);
		this.dropOrder = this.dropOrder.bind(this);
	}

	componentDidMount() {
	  document.title = 'Break Baking Calculator';
	}
	
	onClearAllClick() {
		if (!confirm("Are you sure?")) return;
		
		this.setState({
			breadTypes: [],
			orders: []
		});
	}

	addNewBreadType(newBreadType) {
		if (this.state.breadTypes.some((breadType) => breadType === newBreadType)) {
			alert('There is already a type of bread with that name!');
			return;
		}
		
		let newBreadTypeList = [...this.state.breadTypes, newBreadType];
		this.setState({ breadTypes: newBreadTypeList });
	}

	dropBreadType(droppedBreadType) {
		if (!confirm('Are you sure?  This will cause any orders containing this type of bread to also be dropped!')) return;

		let filteredBreadTypeList = this.state.breadTypes.filter(breadType =>
			breadType !== droppedBreadType
		);
		let filteredOrderList = this.state.orders.filter(order =>
			!order.lineItems.some(lineItem => lineItem.breadType === droppedBreadType)
		);
		this.setState({
			breadTypes: filteredBreadTypeList,
			orders: filteredOrderList
		});
	}

	addNewOrder(newOrder) {
		if (this.state.orders.some((order) => order.customerName === newOrder.customerName)) {
			alert('There is already a customer with that name!');
			return;
		}
		
		let newOrderList = [...this.state.orders, newOrder];
		this.setState({ orders: newOrderList });
	}

	dropOrder(droppedOrderId) {
		if (!confirm('Are you sure?')) return;

		let filteredOrderList = this.state.orders.filter(
			order => order.id !== droppedOrderId
		);
		this.setState({ orders: filteredOrderList });
	}

	render() {
		return (
			<Container>
			  <Box m={1}>
				<Typography variant="h4" component="h1" gutterBottom>
					Bread Baking Calculator
				</Typography>
				<Button variant="contained" onClick={this.onClearAllClick}>Clear All</Button>
				<Divider />
				<BreadTypeAdmin breadTypes={this.state.breadTypes}
					onAddNewBreadType={this.addNewBreadType} onDropBreadType={this.dropBreadType} />
				<Divider />
				<OrderAdmin breadTypeList={this.state.breadTypes} orderList={this.state.orders}
					onAddNewOrder={this.addNewOrder} onDropOrder={this.dropOrder} />
				<Divider />
				<OrderCalculator orderList={this.state.orders} />
			  </Box>
			</Container>
		);
	}
}

export default BreadBakingCalculator;
