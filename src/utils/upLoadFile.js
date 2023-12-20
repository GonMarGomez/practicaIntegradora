export const uploadFile = async (folder, user, type, date, name) => {
    
    const documentInfo = {
        name: `${type}`,
        reference: `public/img/${folder}/${user._id}_${date}_${name}`,
        status: true,
    };
    user.documents.push(documentInfo);

    await user.save();
}