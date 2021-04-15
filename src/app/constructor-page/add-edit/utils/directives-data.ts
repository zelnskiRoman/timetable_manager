import {IDirection, IUniversity} from './interfaces';const universityDirectives: IDirection[] = [{    id: 'xxxxx-xxxxx-xxxxx',    title: 'Автоматизированные системы и технологии',    groups: [{        name: '18-ИДбо-3',        types: ['a', 'б']      }, {        name: '18-ИСбо-2',        types: ['a', 'б']      }],    selected: false  }, {    id: 'yyyyy-yyyyy-yyyyy',    title: '09.03.02 Информационные системы и технологии профиль Интеллектуальные информационные системы',    groups: [{        name: '18-БХбо-1',        types: ['a', 'б', 'в']      }],    selected: false  }, {    id: 'aaaaa-aaaaa-aaaaa',    title: '27.03.02 Управление качеством',    groups: [{      name: '18-ППбо-4',      types: ['a']    }],    selected: false}];const university: IUniversity[] = [{  id: '00000-00000-00000',  title: 'Институт автоматизированных систем и технологий',  selected: false}, {  id: '77777-77777-77777',  title: 'Институт физико-математических и естественных наук',  selected: false}];const directivesLessons: object = {  'xxxxx-xxxxx-xxxxx': [{    id: '11111-11111-11111',    title: 'Web-программирование',    tutors: [{name: 'Зеленский Р.В.'}, {name: 'Соснин Е.А.'}]  }, {    id: '22222-22222-22222',    title: 'Инструменты графического дизайна',    tutors: [{name: 'Соснин Е.А.'}]  }],  'yyyyy-yyyyy-yyyyy': [{    id: '33333-33333-33333',    title: 'Промышленая химия',    tutors: [{name: 'Владимиров Н.В.'}, {name: 'Бессонова Ю.Г.'}]  }, {    id: '44444-44444-44444',    title: 'Биология местности',    tutors: [{name: 'Майчук Р.С.'}]  }],  'aaaaa-aaaaa-aaaaa': []};function getUniversityDirections(id: string): IDirection[] {  const univsIds = {    '00000-00000-00000': 0,    '77777-77777-77777': 1  };  if (univsIds[id] === 0) {    return universityDirectives;  } else {    return [];  }}function getUniversitiesTemp(id: string): IUniversity[] {  if (id === 'lllll-lllll-lllll') {    return university;  } else {    return [];  }}export {  directivesLessons,  getUniversityDirections,  getUniversitiesTemp};