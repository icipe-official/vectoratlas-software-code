import { useAppSelector } from "../../../state/hooks";
import { linearGradientColorMap, maxMinUnitsScaleValues } from "./layerUtils";

export default function ScaleLegend(overlayName:any) {
    const mapStyles = useAppSelector((state) => state.map.map_styles);
    console.log(overlayName)
    console.log(mapStyles)
  return (
    <div style={{
        display: 'flex',
        height: '100%',
        marginLeft:20
        }}
      >
        <div style={{
        display: 'flex',
        height:'100%',
        flexDirection:'column',
        justifyContent:'space-between'
        }}>
          <div style={{display:'flex', background:'black', color:'white', borderRadius:'5px', padding:2, justifyContent:'center'}}>{maxMinUnitsScaleValues(overlayName, mapStyles).max}{maxMinUnitsScaleValues(overlayName, mapStyles).unit}</div>
          <div style={{display:'flex', background:'black', color:'white', borderRadius:'5px', padding:2, justifyContent:'center'}}>{maxMinUnitsScaleValues(overlayName, mapStyles).min}{maxMinUnitsScaleValues(overlayName, mapStyles).unit}</div>
        </div>
        <div style={{
          borderRadius:'5px',
          background: `${linearGradientColorMap(overlayName, mapStyles)}`,
          boxShadow: '0 0 10px black',
          padding:'4px',
          marginLeft: '5px',
          }}>
        </div>
      </div>
  );
}
