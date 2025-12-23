import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Article, User } from "../firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/init";

export default function ArticlePage() {
	const { articleId } = useParams();

	const [articleContent, setArticleContent] = useState();
	const [isAdmin, setAdmin] = useState(false);
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			const u = new User(user.uid);

			u.admin().then((v) => {
				setAdmin(v);
			});
		});
	}, [isAdmin]);

	useEffect(() => {
		const article = new Article(articleId);
		article
			.getMarkdown()
			.then((content) => {
				setArticleContent(content);
			})
			.catch(() => {
				if (isAdmin) {
					article.setDefault();
				}
			});
	}, [articleContent, articleId, isAdmin]);

	return (
		<div
			className="md"
			dangerouslySetInnerHTML={{ __html: articleContent }}
		></div>
	);
}
