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
import { format } from "date-fns";

export const SurveyItem = React.memo(function PopularListItem({
  name,
  registrationNumber,
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
        <Info useStyles={usePopularInfoStyles}>
          <InfoSubtitle>{name}</InfoSubtitle>
          <InfoTitle>{registrationNumber}</InfoTitle>
          <InfoCaption>
            {format(new Date(Number(createdAt)), "yyyy년 MM월 dd일 HH시 mm분")}
          </InfoCaption>
        </Info>
      </Row>
    </>
  );
});

export default SurveyItem;
