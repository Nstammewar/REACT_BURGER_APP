import React, { Component } from "react";
import { connect } from 'react-redux'
import Aux from "../../hoc/Merge";
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummery/OrderSummery';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'


export class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props);
    // }
    state = {
        purchasing: false,
    }

    componentDidMount() {
       this.props.onInitIngredients();
    }

    purchaseHandler = () => {
        if(this.state.isAuthenticated){
            this.setState({purchasing: true});
        }else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }
    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0 ;
    }
    
    
    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }
    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }
    render() {
        const disabledInfo = {
            ...this.props.ings
        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;

        }
        let orderSummery = null;
        let burger = this.props.error?<p>Ingredient can't be loaded!</p>:<Spinner />
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.totalPrice}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler} 
                        isAuth={this.props.isAuthenticated}/>
                </Aux>
            );

            orderSummery = <OrderSummary
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                price={this.props.totalPrice}
                purchaseContinued={this.purchaseContinueHandler} />
        }
        if (this.state.loading) {
            orderSummery = <Spinner />
        }


        return (
            <Aux>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummery}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
const mapStateToProps = state =>{
    return {
        ings:state.burgerBuilder.ingredients,
        totalPrice:state.burgerBuilder.totalPrice,
        error:state.burgerBuilder.error,
        isAuthenticated:state.auth.token!=null,
    }
}
const mapDispatchToProps = dispatch =>{
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients:()=> dispatch(actions.initIngredients()),
        onInitPurchase: ()=>dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch( actions.setAuthRedirectPath(path))
    }
}
export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));