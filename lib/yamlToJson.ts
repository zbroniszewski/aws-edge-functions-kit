import yaml from 'js-yaml';

export function yamlToJson(contents: string) {
  return yaml.load(contents);
}
