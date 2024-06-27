import FindTheNote from "./FindTheNote";
import GetTriadNotes from "./GetTriadNotes";
import NameTheNote from "./NameTheNote";

export enum PracticeComponentNames {
  NameTheNote = "Name the note",
  FindTheNote = "Find the note",
}

export enum HelperComponentNames {
  GetTriadNotes = "Get triad notes",
}

export const PRACTICE_COMPONENTS = {
  [PracticeComponentNames.NameTheNote]: NameTheNote,
  [PracticeComponentNames.FindTheNote]: FindTheNote,
};

export const HELPER_COMPONENTS = {
  [HelperComponentNames.GetTriadNotes]: GetTriadNotes,
};

export const ALL_LEARNING_COMPONENTS = {
  ...PRACTICE_COMPONENTS,
  ...HELPER_COMPONENTS,
};
