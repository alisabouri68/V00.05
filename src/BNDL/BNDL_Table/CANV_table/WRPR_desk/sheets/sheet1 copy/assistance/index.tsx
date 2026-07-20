import AuxiliaryCOMP from "RCMP/RCMP_auxiliary";
import Info from "./info";


function Auxiliary() {
  return (
    <AuxiliaryCOMP
      tabs={[
        {
          active: true,
          disabled: false,
          title: "Info",
          children: <Info />,
        },
        {
          active: true,
          disabled: false,
          title: "Test 1",
          children: "Test 1",
        },
        {
          active: true,
          disabled: false,
          title: "Test 2",
          children: "Test 2",
        },
        {
          active: true,
          disabled: false,
          title: "Test 3",
          children: "Test 3",
        },
      ]}
    />
  );
}

export default Auxiliary;
