const handleEnding = (name, image_id, sound_id, )
  const ending1 = [
	{
	  script: '이제 새로운 팀원을 정할 시간이다.',
	  where: '몰입실',
	  when: '목요일 오후 2시',
	  background_image_id: backgroundImageId.classroom,
	  background_sound_id: backgroundSoundId.serious3,
	  not_character:true,
	  type: 'narration',
	},
	{
	  script: '누구로 하지...',
	  type: 'think',
	},
	{
	  script: '서연...?',
	  type: 'think',
	},
	{
	  script: '아니면 역시 하린...?',
	  type: 'think',
	},
	{
	  script: '그때 heroine_name이 다가왔다.',
	  character_id: characterId.harin,
	  character_image_id: characterImageId.harin_basic,
	  type: 'text',
	},
	{
	  script: '다 끝났는데 딱 한 잔만 하면 딱일 것 같아~',
	  character_id: characterId.harin,
	  type: 'text',
	},
	{
	  script: '다 같이?',
	  character_id: characterId.hero,
	  type: 'text',
	},

  ]