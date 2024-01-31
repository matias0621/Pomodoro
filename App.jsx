import { StyleSheet, Text, View, Platform, SafeAreaView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import Header from "./src/components/Header";
import Timer from "./src/components/Timer";
import { Audio } from "expo-av";

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"];

export default function App() {
  const [isWorking, setWorking] = useState(false);
  const [isTime, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let i = null;

    if (isActive) {
      i = setInterval(() => {
        setTime(isTime - 1);
      }, 1000);
    }
    else {
      clearInterval(i);
    }

    if (isTime === 0) {
      playSoundAlarm();
      setIsActive(false);
      setWorking(prev => !prev);
      setTime(isWorking ? 300 : 1500);
    }

    return () => clearInterval(i);
  }, [isActive, isTime])

  function handleStartStop() {
    playSound();
    setIsActive(!isActive);
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/bambu.mp3")
    )

    await sound.playAsync();
  }
  async function playSoundAlarm() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/alarma.mp3")
    )

    await sound.playAsync();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime] }]}>
      <View style={{ flex: 1 ,paddingHorizontal: 15 ,paddingTop: Platform.OS === "android" && 30, borderWidth: 3 }}>
        <Text style={styles.titulos}>Pomodoro</Text>
        <Header
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setTime={setTime}W
        />
        <Timer time={isTime} />
        <TouchableOpacity onPress={handleStartStop} style={styles.button}>
          <Text style={{ color: "white", fontWeight: "bold" }}> {isActive ? "STOP" : "START"} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulos: {
    fontSize: 32,
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15
  }
});