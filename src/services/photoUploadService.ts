
export const photoUploadService = {
    // handlePickAvatar: async () => {
    //     const res = await ImagePicker.launchImageLibraryAsync({
    //         allowsEditing: true,
    //         aspect: [1, 1],
    //         quality: 0.7,
    //         base64: true,
    //     });

    //     if (!res.canceled && res.assets[0].base64) {
    //         try {
    //             setSaving(true);
    //             const { data: { user } } = await supabase.auth.getUser();
    //             if (!user) return;

    //             const binaryString = atob(res.assets[0].base64);
    //             const bytes = new Uint8Array(binaryString.length);
    //             for (let i = 0; i < binaryString.length; i++) {
    //                 bytes[i] = binaryString.charCodeAt(i);
    //             }

    //             const fileName = `${user.id}_avatar.jpg`;
    //             await supabase.storage.from('animal-photos').upload(`avatars/${fileName}`, bytes, {
    //                 contentType: 'image/jpeg',
    //                 upsert: true,
    //             });

    //             const { data } = supabase.storage
    //                 .from('animal-photos')
    //                 .getPublicUrl(`avatars/${fileName}`);

    //             await supabase
    //                 .from('profiles')
    //                 .update({ avatar_url: data.publicUrl })
    //                 .eq('id', user.id);

    //             setPersonalData((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
    //         } catch {
    //             handleError('Não foi possível alterar a foto de perfil.', 'Erro ao alterar foto de perfil');
    //         } finally {
    //             setSaving(false);
    //         }
    //     }
    // };
}