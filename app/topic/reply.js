'use stirct'

import React,{Component,View,TouchableOpacity,Text,TextInput,Alert} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

import NavBar from "../common/component/navbar"
import containerByComponent from "../lib/redux-helper"

import {topicReducer} from "./reducer"
import {saveReply} from "./action"

import styles from "./stylesheet/topic"
import preferredThemeByName,{theme} from "../common/stylesheet/theme"

class Reply extends Component{
    constructor(props){
        super(props)
        this.state = {
            content:""
        }
        this._preferredTheme = preferredThemeByName(props.userPrefs["preferredTheme"])
        this._preferredThemeDefines = theme[props.userPrefs["preferredTheme"]]
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.replySaving && this.props.replySaving){
            if(nextProps.replySaved){
                Alert.alert("保存成功","",[{text:"确定",onPress:()=>Actions.pop()}])
            }else{
                Alert.alert(nextProps.errMsg,"",[{text:"确定",style:"cancel"}])
            }
        }
    }
    renderNavigationBar(){
        const {navigationActions} = this.props
        const handleSave = async ()=>{
            const user = await global.storage.getItem("user")
            const reply = {
                content:this.state.content,
                reply_id:"",
                accesstoken:user.accessToken
            }
            this.props.actions.saveReply(this.props.id,reply)
        }

        const rightButton = (
            <TouchableOpacity style={[styles.navigationBarButton,{marginLeft:5}]} onPress={handleSave}>
                <Text style={styles.navigationBarButtonText}>发布</Text>
            </TouchableOpacity>
        )

        return <NavBar title="回复" rightButton={()=>rightButton} onLeftButtonClick={()=>navigationActions.popScene("reply")} userPrefs={this.props.userPrefs}/>
    }
    render(){
        return (
            <View style={[styles.container,this._preferredTheme["container"]]}>
            {this.renderNavigationBar()}
            <View style={styles.replyWrap}>
            <TextInput placeholder="回复内容不超过50字" onChangeText={(content)=>this.setState({content})} 
            placeholderTextColor={this._preferredThemeDefines["publishLabel"].color} 
            defaultValue={this.props.replyTo?`@${this.props.replyTo.author.loginname} `:""} numberOfLines={10} 
            multiline={true} maxLength={200} 
            style={[styles.replyInput,this._preferredTheme["replyInput"]]}/>
            </View>
            </View>
        )
    }
}

export default containerByComponent(Reply,topicReducer,{saveReply})