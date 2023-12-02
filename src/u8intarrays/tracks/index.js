import MKS from "./MKS";
import WP from "./WP";
import SSC from "./SSC";
import TR from "./TR";
import MC from "./MC";
import TH from "./TH";
import TM from "./TM";
import SGF from "./SGF";
import SA from "./SA";
import DS from "./DS";
import Ed from "./Ed";
import MW from "./MW";
import CC from "./CC";
import BDD from "./BDD";
import BC from "./BC";
import RR from "./RR";
import rMMM from "./rMMM";
import rMC from "./rMC";
import rCCB from "./rCCB";
import rTT from "./rTT";
import rDDD from "./rDDD";
import rDP3 from "./rDP3";
import rRRy from "./rRRy";
import rDKJ from "./rDKJ";
import rWS from "./rWS";
import rSL from "./rSL";
import rMP from "./rMP";
import rYV from "./rYV";
import rTTC from "./rTTC";
import rPPS from "./rPPS";
import rGV from "./rGV";
import rRRd from "./rRRd";
import dYC from "./dYC";
import dEA from "./dEA";
import dDD from "./dDD";
import dMC from "./dMC";
import dWGM from "./dWGM";
import dRR from "./dRR";
import dIIO from "./dIIO";
import dHC from "./dHC";
import dBP from "./dBP";
import dCL from "./dCL";
import dWW from "./dWW";
import dAC from "./dAC";
import dNBC from "./dNBC";
import dRiR from "./dRiR";
import dSBS from "./dSBS";
import dBB from "./dBB";
import bPP from "./bPP";
import bTC from "./bTC";
import bCMo from "./bCMo";
import bCMa from "./bCMa";
import bTB from "./bTB";
import bSR from "./bSR";
import bSG from "./bSG";
import bNH from "./bNH";
import bNYM from "./bNYM";
import bMC3 from "./bMC3";
import bKD from "./bKD";
import bWP from "./bWP";
import bSS from "./bSS";
import bSL from "./bSL";
import bMG from "./bMG";
import bSHS from "./bSHS";
import bLL from "./bLL";
import bBL from "./bBL";
import bRRM from "./bRRM";
import bMT from "./bMT";
import bBB from "./bBB";
import bPG from "./bPG";
import bMM from "./bMM";
import bRR7 from "./bRR7";
import bAD from "./bAD";
import bRP from "./bRP";
import bDKS from "./bDKS";
import bYI from "./bYI";
import bBR from "./bBR";
import bMC from "./bMC";
import bWS from "./bWS";
import bSSy from "./bSSy";
import bAtD from "./bAtD";
import bDC from "./bDC";
import bMH from "./bMH";
import bSCS from "./bSCS";
import bLAL from "./bLAL";
import bSW from "./bSW";
import bKC from "./bKC";
import bVV from "./bVV";
import bRA from "./bRA";
import bDKM from "./bDKM";
import bDCt from "./bDCt";
import bPPC from "./bPPC";
import bMD from "./bMD";
import bRIW from "./bRIW";
import bBC3 from "./bBC3";
import bRRw from "./bRRw";

const u8intTracks = [
  ["MKS", MKS],
  ["WP", WP],
  ["SSC", SSC],
  ["TR", TR],
  ["MC", MC],
  ["TH", TH],
  ["TM", TM],
  ["SGF", SGF],
  ["SA", SA],
  ["DS", DS],
  ["Ed", Ed],
  ["MW", MW],
  ["CC", CC],
  ["BDD", BDD],
  ["BC", BC],
  ["RR", RR],
  ["rMMM", rMMM],
  ["rMC", rMC],
  ["rCCB", rCCB],
  ["rTT", rTT],
  ["rDDD", rDDD],
  ["rDP3", rDP3],
  ["rRRy", rRRy],
  ["rDKJ", rDKJ],
  ["rWS", rWS],
  ["rSL", rSL],
  ["rMP", rMP],
  ["rYV", rYV],
  ["rTTC", rTTC],
  ["rPPS", rPPS],
  ["rGV", rGV],
  ["rRRd", rRRd],
  ["dYC", dYC],
  ["dEA", dEA],
  ["dDD", dDD],
  ["dMC", dMC],
  ["dWGM", dWGM],
  ["dRR", dRR],
  ["dIIO", dIIO],
  ["dHC", dHC],
  ["dBP", dBP],
  ["dCL", dCL],
  ["dWW", dWW],
  ["dAC", dAC],
  ["dNBC", dNBC],
  ["dRiR", dRiR],
  ["dSBS", dSBS],
  ["dBB", dBB],
  ["bPP", bPP],
  ["bTC", bTC],
  ["bCMo", bCMo],
  ["bCMa", bCMa],
  ["bTB", bTB],
  ["bSR", bSR],
  ["bSG", bSG],
  ["bNH", bNH],
  ["bNYM", bNYM],
  ["bMC3", bMC3],
  ["bKD", bKD],
  ["bWP", bWP],
  ["bSS", bSS],
  ["bSL", bSL],
  ["bMG", bMG],
  ["bSHS", bSHS],
  ["bLL", bLL],
  ["bBL", bBL],
  ["bRRM", bRRM],
  ["bMT", bMT],
  ["bBB", bBB],
  ["bPG", bPG],
  ["bMM", bMM],
  ["bRR7", bRR7],
  ["bAD", bAD],
  ["bRP", bRP],
  ["bDKS", bDKS],
  ["bYI", bYI],
  ["bBR", bBR],
  ["bMC", bMC],
  ["bWS", bWS],
  ["bSSy", bSSy],
  ["bAtD", bAtD],
  ["bDC", bDC],
  ["bMH", bMH],
  ["bSCS", bSCS],
  ["bLAL", bLAL],
  ["bSW", bSW],
  ["bKC", bKC],
  ["bVV", bVV],
  ["bRA", bRA],
  ["bDKM", bDKM],
  ["bDCt", bDCt],
  ["bPPC", bPPC],
  ["bMD", bMD],
  ["bRIW", bRIW],
  ["bBC3", bBC3],
  ["bRRw", bRRw],
];

export default u8intTracks;
