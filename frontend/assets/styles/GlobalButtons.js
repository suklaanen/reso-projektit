import { StyleSheet } from "react-native";

const GlobalButtons = StyleSheet.create({
  buttonMargin: {
    marginVertical: 12,
    marginHorizontal: 6,
  },

  buttonBase: {
    borderRadius: 22,
    borderColor: "#bbbbbb",
    borderWidth: 1,
    borderStyle: "solid",
    padding: 16,
    marginVertical: 8,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonContinue: {
    backgroundColor: "#003366",
  },

  buttonNavigate: {
    backgroundColor: "#e8e8e8",
    width: "75%",
    borderColor: "#bbbbbb",
    borderWidth: 1,
    borderStyle: "solid",
    padding: 11,
    marginVertical: 8,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonDelete: {
    backgroundColor: "#720002",
    width: "35%",
    marginRight: 8,
  },

  buttonConfirm: {
    backgroundColor: "#c84244",
    width: "35%",
    marginRight: 8,
  },

  buttonCancel: {
    backgroundColor: "#c3c3c3",
    width: "35%",
  },

  buttonEdit: {
    backgroundColor: "#113c6b",
    width: "45%",
  },

  buttonAdd: {
    backgroundColor: "#3d3d45",
    width: "55%",
  },

  buttonSave: {
    backgroundColor: "#186b11",
    width: "35%",
  },

  buttonPage: {
    backgroundColor: "#d0d0d0",
    width: "30%",
  },

  buttonSetup: {
    backgroundColor: "#8bb1e7",
    width: "100%",
  },

  buttonReset: {
    backgroundColor: "#d0d0d0",
    width: "100%",
  },

  whiteBase: {
    color: "#ffffff",
    textAlign: "center",
  },

  blackBase: {
    color: "#000000",
    textAlign: "center",
  },

  size14: {
    fontSize: 14,
  },

  size16: {
    fontSize: 16,
  },

  size20: {
    fontSize: 20,
  },

  size24: {
    fontSize: 24,
  },

  size18: {
    fontSize: 18,
  },

});

export default GlobalButtons;
