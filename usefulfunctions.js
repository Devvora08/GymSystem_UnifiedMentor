//temp function to populate the bills of 10 members. 
async function createBill(){
    try{
        const members = await AllMember.find();  //fetch total members first
        for(const member of members){
            const user = await AllUser.findById(member.userId);  
            if (!user) {
                console.error(`User not found for member ID: ${member._id}`);
                continue; // Skip to the next member if user is not found
            }
            const billData = await Bill.create({
                memberId: member._id, // Use the member's ObjectId
                amount: Math.floor(Math.random() * 20000) + 5000, // Random amount between 1-100
                status: Math.random() < 0.5 ? 'Paid' : 'Unpaid', // Randomly assign Paid/Unpaid
                dueDate: new Date(), // Current date, or set as needed
                username: user.name // Add user's name to bill data if needed
              });
        
        }
        console.log('Bills generated successfully!');
    }
    catch(error){
        console.error('Error generating bills:', error);
    }
}

//createBill()