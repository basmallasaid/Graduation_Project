import React, {Component} from "react";
import ErrorPage from "./Erorrpage";
class StanderErrorBoundary extends Component{
    constructor(props){
        super()
        this.state={
            hasError:false,
            error:undefined,
        }
    }
    
    static getDerivedStateFromError(error){ 
        return {
            hasError :true,
            error:error
        }

    }
    componentDidCatch(error,errorinfo){
        console.error(error);
        console.error(errorinfo);
        
    }
    render(){
        if(this.state.hasError){
            return <ErrorPage/>
        }
        else{
            return this.props.children
        }
      
    }
}
export default StanderErrorBoundary;