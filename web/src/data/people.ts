export interface Person {
  avatar: string;
  github: string;
  linkedin?: string;
  name: string;
  title?: string;
}

function github({
  linkedin,
  username,
  ...rest
}: Omit<Person, 'avatar' | 'github'> & { username: string }): Person {
  return {
    ...rest,
    avatar: `https://avatars.githubusercontent.com/${username}?size=64`,
    github: `https://github.com/${username}`,
    linkedin: linkedin ? `https://linkedin.com/in/${linkedin}` : undefined,
  };
}

export const dmitriyBrolnickij = github({
  name: 'Dmitriy Brolnickij',
  username: 'brolnickij',
});

export const ferdiKoomen = github({
  name: 'Ferdi Koomen',
  title: 'OpenAPI TypeScript Codegen',
  username: 'ferdikoomen',
});

export const jacobCohen = github({
  name: 'Jacob Cohen',
  username: 'jacobinu',
});

export const jordanShatford = github({
  name: 'Jordan Shatford',
  title: 'Maintainer and Contributor',
  username: 'jordanshatford',
});

export const joshHemphill = github({
  name: 'Josh Hemphill',
  username: 'josh-hemphill',
});

export const lubos = github({
  linkedin: 'mrlubos',
  name: 'Lubos',
  title: 'Hey API',
  username: 'mrlubos',
});

export const malcolmKee = github({
  name: 'Malcolm Kee',
  username: 'malcolm-kee',
});

export const maxScopp = github({
  name: 'Max Scopp',
  username: 'max-scopp',
});

export const nicolasChaulet = github({
  name: 'Nicolas Chaulet',
  title: 'Made the Hey API fork',
  username: 'nicolas-chaulet',
});

export const sebastiaanWouters = github({
  name: 'Sebastiaan Wouters',
  username: 'SebastiaanWouters',
});

export const stephenZhou = github({
  name: 'Stephen Zhou',
  username: 'hyoban',
});

export const sukka = github({
  name: 'Sukka',
  title: 'Contributor',
  username: 'sukkaw',
});

export const yuriMikhin = github({
  name: 'Yuri Mikhin',
  username: 'mikhin',
});

export const coreTeam: Array<Person> = [lubos];

export const hallOfFame: Array<Person> = [ferdiKoomen, nicolasChaulet, jordanShatford, sukka];
