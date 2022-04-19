# WorldSkills Korea Cloud Computing 2021 1st Project

## Introduce

2021년 대전광역시 제56회 전국기능경기대회 제1과제 `Web Service Provisioning` 프로젝트를
자동으로 채점해주는 exe 프로그램입니다.

다른 선수분들이 이 과제를 다 수행하시고 나서 채점을 할 때 시간을 좀 아껴드리고자 직접 개발하게
되었습니다.

라이센스는 [MIT LICENSE](LICENSE)이며, 필요하시다면 당연히 코드 수정하셔도 됩니다.

버그를 발견하신다면 Pull Requests 보내주시면 감사하겠습니다.

## Feature

이 프로그램은 과제에서 요구하는 Bastion Server에 **SSH**로 접근해서 채점을 진행합니다.

따라서, SSH에 접근이 불가능하면 채점 자체가 진행되지 않습니다. 이점 반드시 참고바랍니다.
