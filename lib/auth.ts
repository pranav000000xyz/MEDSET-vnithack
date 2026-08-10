export interface DemoUser { id: string; name: string; email: string; role: 'Developer'; password: string; active: boolean; }
export const demoUsers: DemoUser[] = [
 { id:'DEV-PRANAV-01', name:'Pranav Vispute', email:'pranav.vispute@medset.demo', role:'Developer', password:'SbjainBestCollege', active:true },
 { id:'DEV-DEVANSHU-02', name:'Devanshu Kindarley', email:'devanshu.kindarley@medset.demo', role:'Developer', password:'SbjainBestCollege', active:true },
 { id:'DEV-PRAJWAL-03', name:'Prajwal', email:'prajwal@medset.demo', role:'Developer', password:'SbjainBestCollege', active:true },
 { id:'DEV-DHRUVI-04', name:'Dhruvi', email:'dhruvi@medset.demo', role:'Developer', password:'SbjainBestCollege', active:true },
 { id:'DEV-PUSHKAR-05', name:'Pushkar Meshram', email:'pushkar.meshram@medset.demo', role:'Developer', password:'SbjainBestCollege', active:true },
];
export function authenticate(email: string, password: string) { return demoUsers.find(user => user.email.toLowerCase()===email.toLowerCase() && user.password===password && user.active); }
