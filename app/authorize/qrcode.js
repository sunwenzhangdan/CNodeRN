'use strict'

import React, {Component, View, StyleSheet, Dimensions, Text, TouchableOpacity,Platform} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

import Scanner from "../common/component/scanner"
import NavBar from "../common/component/navbar"
import Toast from "../common/component/toast"

import containerByComponent from "../lib/redux-helper"
import {authorizeByToken} from "./action"
import {authorizeReducer} from "./reducer"

class QrCode extends Component {
    constructor(props) {
        super(props)
        this.successed = false
    }
    handleBarCodeRead(ret) {
        if(this.successed){
            return
        }
        this.successed = true
        this.props.actions.authorizeByToken(ret.data)
    }
    componentWillReceiveProps(nextProps){
        const {navigationActions} = this.props
        if(!nextProps.isAuthorizing && this.props.isAuthorizing){
            if(nextProps.isAuthorized){
                this.toast.show("登录成功",()=>{
                    global.storage.setItem("user",nextProps.user).then((err)=>{
                        navigationActions.popScene("qrcode")
                    })
                })
            }else{
                this.toast.show("登录失败")
            }
        }
    }
    render() {
        const {navigationActions} = this.props
        return (
            <View style={styles.container}>
                <NavBar leftButton="取消" onLeftButtonClick={()=>navigationActions.popScene("qrcode")} userPrefs={this.props.userPrefs}/>
                <Scanner handleBarCodeRead={this.handleBarCodeRead.bind(this)}/>
                <Toast ref={(view)=>this.toast=view}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})

export default containerByComponent(QrCode,authorizeReducer,{authorizeByToken})