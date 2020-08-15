import React, {useState, useContext} from "react";
import {TouchableOpacity, View} from "react-native";
import Context from "../../context";

import Field from '../Field'
// import {Tooltip} from "react-native-elements";
import {MaterialIcons} from '@expo/vector-icons';

// const MyButton = styled(Button)({
//     borderRadius: 3,
//     margin: '1rem'
// });

const types = {
  birthday: 'date',
  doc_date: 'date',
}

let count = 1;

export const CustomerView = props => {

  const [isDetails, setDetails] = useState(false)
  // const {app, setLoading} = useContext(Context)


  // console.log(app.fields.allElements)
  console.log('count2', count++)

  return <View>

    <View
      style={{margin: 1}}
      direction="row"
      justify="space-between"
    >

      <TouchableOpacity
        onPress={() => setDetails(!isDetails)}
      >
        <MaterialIcons
          name={isDetails
            ? 'expand-less'
            : 'expand-more'
        }
                       size={24}
          color="black"
        />
          {/*<IconButton*/}
          {/*  onClick={}*/}
          {/*>*/}
          {/*  {isDetails*/}
          {/*    ? <ExpandLessIcon/>*/}
          {/*    : <ExpandMoreIcon/>*/}
          {/*  }*/}
          {/*</IconButton>*/}

      </TouchableOpacity>
    </View>

    <View item xs={12}>
      {/*{typeof app.fields === 'object'*/}
      {/*    ? app.fields.allElements*/}
      {/*        .filter(field => field.index === 'customer' && field.is_valid)*/}
      {/*        .filter(field => isDetails || ['fio', 'phone_number'].includes(field.name))*/}
      {/*        .map(field => <Field field={field} key={'custfielviewkey' + field.id}/>)*/}
      {/*    : null*/}
      {/*}*/}
    </View>
    {/*// <View >*/}
    {/*//     <MyButton*/}
    {/*//         variant="contained"*/}
    {/*//         color="secondary"*/}
    {/*//         size="small"*/}
    {/*//         onClick={() => props.reset()}*/}
    {/*//         disabled={props.disabled}*/}
    {/*//     >*/}
    {/*//         Отмена*/}
    {/*//     </MyButton>*/}
    {/*//     {props.customer*/}
    {/*//         ? <MyButton*/}
    {/*//             variant="contained"*/}
    {/*//             color="primary"*/}
    {/*//             size="small"*/}
    {/*//             onClick={() => props.create()}*/}
    {/*//             disabled={props.disabled}*/}
    {/*//         >*/}
    {/*//             Создать*/}
    {/*//         </MyButton>*/}
    {/*//         : <MyButton*/}
    {/*//             variant="contained"*/}
    {/*//             color="primary"*/}
    {/*//             size="small"*/}
    {/*//             onClick={() => props.update()}*/}
    {/*            disabled={props.disabled}*/}
    {/*        >*/}
    {/*            Сохранить*/}
    {/*        </MyButton>*/}
    {/*    }*/}
    {/*</Grid>*/}
  </View>

}