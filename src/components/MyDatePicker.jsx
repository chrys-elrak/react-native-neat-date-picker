import React, { useState, useEffect, memo } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Button, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import ChangeMonthModal from '../components/ChangeMonthModal'
import { MaterialIcons as MDicon } from '@expo/vector-icons'
import { getMonthInChinese } from '../lib/lib';
import {
    useFonts,
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
} from '@expo-google-fonts/roboto'


// const data = { days: 26, firstDay: 5, prevMonthDays: 31 }

const MyDatePicker = ({ isVisible, setIsVisible, displayDate: inputDisplayDate, mode, onConfirm, minDate, maxDate }) => {
    const [showChangeMonthModal, setShowChangeMonthModal] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const sevenDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const now = new Date()
    const [displayDate, setDisplayDate] = useState(inputDisplayDate || new Date(now.getFullYear(), now.getMonth(), now.getDate())
    );
    const Time = {
        year: displayDate.getFullYear(),
        month: displayDate.getMonth(), // 0-base
        date: displayDate.getDate(),
    }
    const [output, setOutput] = useState(mode === 'single' ? { date: displayDate, startDate: null, endDate: null } : { date: null, startDate: displayDate, endDate: null });
    console.log(JSON.stringify(output))

    let minTime, maxTime
    if (minDate & maxDate) {
        minTime = minDate.getTime()
        maxTime = maxDate.getTime()
    }
    const data = useDaysOfMonth(displayDate, minTime, maxTime)



    const Key = memo(({ eachDay }) => {
        console.log('key')
        const onKeyPress = () => {
            if (mode === 'single') {
                if (eachDay.disable) {

                } else {
                    let newDate = new Date(eachDay.year, eachDay.month, eachDay.date)
                    let setTo = {
                        date: newDate,
                        startDate: null,
                        endDate: null,
                    }
                    if (minDate & maxDate) {
                        if (newDate.getTime() > maxTime | newDate.getTime() < minTime) {

                        } else {
                            setOutput(setTo)
                        }
                    } else {
                        setOutput(setTo)
                    }
                }
            }
            if (mode === 'range') {
                let thisKeyDate = new Date(eachDay.year, eachDay.month, eachDay.date)
                if (minDate & maxDate) {
                    if (eachDay.disable) {

                    } else {
                        if (output.endDate | (thisKeyDate.getTime() < output.startDate.getTime())) {
                            let setTo = {
                                date: null,
                                startDate: thisKeyDate,
                                endDate: null,
                            }
                            setOutput(setTo)
                        } else if (!output.endDatez) {
                            let setTo = {
                                ...output,
                                endDate: thisKeyDate
                            }
                            setOutput(setTo)
                        }
                    }

                } else {
                    if (output.endDate | (thisKeyDate.getTime() < output.startDate.getTime())) {
                        let setTo = {
                            date: null,
                            startDate: thisKeyDate,
                            endDate: null,
                        }
                        setOutput(setTo)
                    } else if (!output.endDatez) {
                        let setTo = {
                            ...output,
                            endDate: thisKeyDate
                        }
                        setOutput(setTo)
                    }
                }

            }
        }
        const getBackgroundColor = () => {
            let yearOfThisKey = eachDay.year
            let monthOfThisKey = eachDay.month
            let dateOfThisKey = eachDay.date
            if (mode === 'single') {
                if (monthOfThisKey === output.date.getMonth() & dateOfThisKey === output.date.getDate()) return 'skyblue'
                else return 'white'
            }
            if (mode === 'range') {
                let timeOfThisKey = new Date(yearOfThisKey, monthOfThisKey, dateOfThisKey).getTime()
                if (!output.endDate) {
                    if (timeOfThisKey === output.startDate.getTime()) return 'skyblue'
                    else return 'white'
                } else {
                    if (timeOfThisKey >= output.startDate.getTime() & timeOfThisKey <= output.endDate.getTime()) return 'skyblue'
                    else return 'white'
                }
            }
        }
        return (
            <TouchableOpacity onPress={onKeyPress}
                style={[styles.keys, { backgroundColor: getBackgroundColor() }]}>
                <Text style={[styles.keys_text, { opacity: eachDay.disable ? 0.25 : 1, fontFamily: eachDay.fontFamily, }]}>{eachDay.date}</Text>
            </TouchableOpacity>
        )
    })


    const onCancelPress = () => {
        setIsVisible(false)
        if (mode === 'single') setOutput({ date: displayDate, startDate: null, endDate: null })
        if (mode === 'range') {
            setOutput({
                date: null,
                startDate: displayDate,
                endDate: null
            })
        }
    }
    const onConfirmPress = () => {
        setIsVisible(false)
        if (mode === 'single') {
            onConfirm(output.date)
        }
        if (mode === 'range') {
            if (!output.endDate) {
                output.endDate = output.startDate
                setOutput({ ...output, endDate: null })
            }
            onConfirm(output.startDate, output.endDate)
        }
    }
    const onPrev = () => {
        setBtnDisabled(true)
        setDisplayDate(new Date(Time.year, Time.month - 1, Time.date))
    }
    const onNext = () => {
        setBtnDisabled(true)
        setDisplayDate(new Date(Time.year, Time.month + 1, Time.date))
    }

    useEffect(() => {
        setTimeout(setBtnDisabled, 200, false)
    }, [btnDisabled, minDate, maxDate])
    const [isFontsLoaded] = useFonts({
        Roboto_100Thin,
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    })
    if (!isFontsLoaded) return null
    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onCancelPress}
            onBackdropPress={onCancelPress}
            style={{ alignItems: 'center', padding: 0, margin: 0 }}
        >
            <View style={styles.modal_container}>

                <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between', alignItems: 'center', }}>
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onPrev} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-left'} size={32} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={{ fontSize: 18 }}>{data.displayYear}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setShowChangeMonthModal(true) }}>
                        <Text style={{ fontSize: 18 }}>{getMonthInChinese(data.displayMonth)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onNext} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-right'} size={32} />
                    </TouchableOpacity>
                </View>

                <View style={styles.keys_container}>
                    {
                        sevenDays.map((n, i) => (
                            <View style={styles.keys} key={i}><Text style={{ color: 'skyblue', fontSize: 16, }}>{n}</Text></View>
                        ))
                    }
                    {
                        data.dateArray.map((eachDay, i) => (
                            <Key key={i.toString()} eachDay={eachDay} />
                        ))
                    }

                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
                            <Text style={styles.btn_text}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
                            <Text style={[styles.btn_text, { color: '#4682E9' }]}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ChangeMonthModal
                    isVisible={showChangeMonthModal}
                    dismiss={() => { setShowChangeMonthModal(false) }}
                    year={Time.year}
                    month={Time.month}
                    date={Time.date}
                    setDisplayDate={setDisplayDate}
                />
            </View>
        </Modal>
    )
}

MyDatePicker.proptype = {
    isVisible: PropTypes.bool,
    setIsVisible: PropTypes.func,
    text: PropTypes.string,

}

export default MyDatePicker

const styles = StyleSheet.create({
    modal_container: {
        width: '100%',
        paddingTop: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keys_container: {
        // borderWidth: 1,
        width: 300,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    keys: {
        // borderWidth: 1,
        width: 36,
        height: 36,
        borderRadius: 10,
        marginTop: 4,
        marginRight: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keys_text: {
        fontSize: 16,
        fontFamily: 'Roboto_300Light'
    },
    footer: {
        borderWidth: 1,
        width: '100%',
        height: 52,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn_box: {
        width: 130,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
    btn: {
        width: 54,
        height: 36,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        fontSize: 18,
        // lineHeight: 22,

    },
    changeMonthTO: {
        borderWidth: 1,
        alignItems: 'center',
        width: 50,
        padding: 4,
        borderColor: 'black',

    }
});