async function fetchData() {
    const res=await fetch ("https://brainrot-jia-seed-hackathon.devpost.com/?ref_feature=challenge&ref_medium=your-open-hackathons&ref_content=Submissions+open");
    const record=await res.json();
    document.getElementById("date").innerHTML=record.data[0].date;
    document.getElementById("areaName").innerHTML=record.data[0].areaName;
    document.getElementById("latestBy").innerHTML=record.data[0].latestBy;
    document.getElementById("deathNew").innerHTML=record.data[0].deathNew;
}
fetchData();