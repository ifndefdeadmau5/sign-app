import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Row, Item } from "@mui-treasury/components/flex";
import {
  Info,
  InfoTitle,
  InfoSubtitle,
  InfoCaption,
} from "@mui-treasury/components/info";
import { useDynamicAvatarStyles } from "@mui-treasury/styles/avatar/dynamic";
import { usePopularInfoStyles } from "@mui-treasury/styles/info/popular";

export const SurveyItem = React.memo(function PopularListItem({
  name,
  createdAt,
  imgUrl,
  onClick,
}) {
  const avatarStyles = useDynamicAvatarStyles({
    height: 56,
    width: 64,
    radius: 8,
  });
  return (
    <>
      <Row gap={3} onClick={onClick}>
        <Item>
          <Avatar variant={"rounded"} classes={avatarStyles} src={imgUrl} />
        </Item>
        <Info useStyles={usePopularInfoStyles}>
          <InfoSubtitle>{name}</InfoSubtitle>
          <InfoTitle>동의서 기본양식</InfoTitle>
          <InfoCaption>
            {new Date(Number(createdAt)).toLocaleTimeString()}
          </InfoCaption>
        </Info>
      </Row>
    </>
  );
});

export default SurveyItem;
